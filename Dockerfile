FROM ubuntu:18.04
RUN apt-get update -y
RUN apt-get install -y python3-pip python3-dev build-essential
COPY ./src /app
WORKDIR /app
RUN pip3 install flask-cors --upgrade
RUN pip3 install -r requirements.txt
ENTRYPOINT ["python3"]
CMD ["app.py"]
