import {SandboxedJob} from 'bullmq';
import * as fs from 'fs';
import {DivanJobsModel, JobStatus} from '../jobs/models/divan.jobs.model';
import {DivanDoc, VariantType, DivanModel} from '../jobs/models/divan.model';
import appConfig from '../config/app.config';
import {spawnSync} from 'child_process';
import connectDB, {closeDB} from '../mongoose';
import {deleteFileorFolder, fileOrPathExists, writeDivanFile,} from '@cubrepgwas/pgwascommon';
import * as extract from "extract-zip";
import * as globby from "globby";

function sleep(ms) {
    console.log('sleeping');
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJobParameters(parameters: DivanDoc) {
    if (parameters.variant_type === VariantType.KNOWN) {
        return [
            parameters.variant_type,
            parameters.disease,
            parameters.variant_db
        ];
    } else {
        return [
            parameters.variant_type,
            parameters.disease
        ];
    }
}

export default async (job: SandboxedJob) => {
    //executed for each job
    console.log(
        'Worker ' +
        ' processing job ' +
        JSON.stringify(job.data.jobId) +
        ' Job name: ' +
        JSON.stringify(job.data.jobName),
    );

    await connectDB();
    await sleep(2000);

    //fetch job parameters from database
    const parameters = await DivanModel.findOne({
        job: job.data.jobId,
    }).exec();

    const jobParams = await DivanJobsModel.findById(job.data.jobId).exec();

    //--1
    let fileInput = jobParams.inputFile;

    //check if file is a zipped file
    if (/[^.]+$/.exec(jobParams.inputFile)[0] === 'zip') {
        fs.mkdirSync(`/pv/analysis/${jobParams.jobUID}/zip`, {recursive: true});
        await extract(jobParams.inputFile, {dir: `/pv/analysis/${jobParams.jobUID}/zip/`});
        const paths = await globby(`/pv/analysis/${jobParams.jobUID}/zip/*.*`);
        if (paths.length === 0) {
            throw new Error('Zip had no files')
        }
        if (paths.length > 1) {
            throw new Error('Zip had too many files')
        }
        fileInput = paths[0]
    }

    //create input file and folder
    let filename;

    //--2
    //extract file name
    const name = fileInput.split(/(\\|\/)/g).pop();

    if (parameters.useTest === false) {
        filename = `/pv/analysis/${jobParams.jobUID}/input/${name}`;
    } else {
        filename = `/pv/analysis/${jobParams.jobUID}/input/test.txt`;
    }

    // console.log("job params: ", jobParams);
    // console.log("parameters: ", parameters);
    //write the exact columns needed by the analysis
    //--3
    if (parameters.input_type === "variant_based") {
        // console.log("Here 225");
        writeDivanFile(fileInput, filename, {
            marker_name: parameters.marker_name - 1,
        }, parameters.input_type);
    }

    if (parameters.input_type === "region_based") {
        // console.log("Here 226");
        writeDivanFile(fileInput, filename, {
            chr: parameters.chr - 1,
            start_position: parameters.start_position - 1,
            stop_position: parameters.stop_position - 1,
        }, parameters.input_type);
    }

    // console.log("here 232");

    if (parameters.useTest === false) {
        deleteFileorFolder(jobParams.inputFile).then(() => {
            // console.log('deleted');
        });
    }

    //--4
    if (/[^.]+$/.exec(jobParams.inputFile)[0] === 'zip') {
        deleteFileorFolder(fileInput).then(() => {
            console.log('deleted');
        });
    }

    //assemble job parameters
    const pathToInputFile = filename;
    const pathToOutputDir = `/pv/analysis/${job.data.jobUID}/${appConfig.appName}/output`;
    const jobParameters = getJobParameters(parameters);

    //@ts-ignore
    jobParameters.unshift(pathToInputFile, pathToOutputDir);

    console.log("job Parameters: ", jobParameters);
    //make output directory
    fs.mkdirSync(pathToOutputDir, {recursive: true});

    // save in mongo database
    await DivanJobsModel.findByIdAndUpdate(
        job.data.jobId,
        {
            status: JobStatus.RUNNING,
            inputFile: filename,
        },
        {new: true},
    );

    await sleep(3000);
    //spawn process
    const jobSpawn = spawnSync(
        // './pipeline_scripts/pascal.sh &>/dev/null',
        './pipeline_scripts/pipeline.sh',
        jobParameters,
        {maxBuffer: 1024 * 1024 * 1024},
    );

    console.log('Spawn command log');
    console.log(jobSpawn?.stdout?.toString());
    console.log('=====================================');
    console.log('Spawn error log');
    const error_msg = jobSpawn?.stderr?.toString();
    console.log(error_msg);

    const resultsFile = await fileOrPathExists(
        `${pathToOutputDir}/score.txt`,
    );

    //close database connection
    closeDB();

    if (resultsFile) {
        return true;
    } else {
        throw new Error(error_msg || 'Job failed to successfully complete');
    }

    return true;
};
