FROM python:3.10
WORKDIR /infinityApp
COPY app ./app
COPY requirements.txt .
COPY main.py .
COPY environ_with_vals.txt .
RUN pip install -r requirements.txt
RUN mv environ_with_vals.txt .env
ENTRYPOINT [ "python", "main.py" ]

EXPOSE 5000