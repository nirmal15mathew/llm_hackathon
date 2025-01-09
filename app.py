# app.py
from fastapi import FastAPI, WebSocket, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llm import update_context_files
# from sockets import sio_app

import asyncio

async def async_generate_llm_stream(query: str):
    for chunk in ask_llm(query):  # Synchronous generator
        await asyncio.sleep(0)  # Yield control back to the event loop
        yield chunk

class QueryStr(BaseModel):
    query: str

app = FastAPI()
# app.mount('/', app=sio_app)

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}
# Define the request body model
class TextRequest(BaseModel):
    text: str


@app.post('/submit-file')
async def submit_file(file: UploadFile):
    with open(f"data/{file.filename}", 'wb') as f:
        file_bytes = await file.read()
        f.write(file_bytes)
    update_context_files()
    return {
        "filename": file.filename
    }

@app.post("/submit-text")
async def submit_text(request: TextRequest):
    # Log or process the received text
    received_text = request.text
    print(f"Received text: {received_text}")
    # ask_llm(received_text, callback=callback_fn)

    return {"message": f"Text '{received_text}' received successfully!"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        # async for chunk in async_generate_llm_stream(data):
        #     await websocket.send_text(f"{chunk}")
        await websocket.send_text("end_stream")