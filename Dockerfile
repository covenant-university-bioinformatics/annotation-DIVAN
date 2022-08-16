FROM ubuntu 
ENV CI=true
ENV PIP_IGNORE_INSTALLED=0

WORKDIR /app

## install R 
## to stop interactve  input tzdata (timezone)
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Africa/Lagos

RUN  apt-get update && apt-get -y install r-base r-base-dev
#RUN  R -e "install.packages(c('qqman'),dependencies=TRUE, repos='http://cran.rstudio.com/')"


RUN apt-get -y install libcurl4-openssl-dev ## to resolve the issue this issue ---> installation of package 'RCurl' had non-zero exit status

RUN  R -e  "install.packages('BiocManager')"
RUN   R -e 'BiocManager::install(ask = F)' &&  R -e "BiocManager::install('GenomicRanges')"

COPY scripts/script.sh ./scripts/

RUN apt-get install -y dos2unix
RUN dos2unix /app/scripts/script.sh
RUN chmod 775 /app/scripts/script.sh

#ENTRYPOINT ["bash", "/app/scripts.sh"]
CMD ["bash", "/app/scripts/script.sh"]


