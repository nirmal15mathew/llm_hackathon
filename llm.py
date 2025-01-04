import ollama
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, ServiceContext, StorageContext, Settings, load_index_from_storage
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.huggingface import HuggingFaceEmbedding


import os

# Set the OpenAI API key as an environment variable
os.environ["HF_TOKEN"] = "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"

print("Initilializing")

# Step 1: Load documents from the 'data' directory
Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-base-en-v1.5")
print("Loaded embedding model")
Settings.llm = Ollama(model="llama2", request_timeout=360.0)
print("Loaded LLM")

# check if storage already exists
PERSIST_DIR = "./storage"
if not os.path.exists(PERSIST_DIR):
    # load the documents and create the index
    documents = SimpleDirectoryReader("data").load_data()
    print("Loaded documents")
    index = VectorStoreIndex.from_documents(documents,show_progress=True)
    # store it for later
    index.storage_context.persist(persist_dir=PERSIST_DIR)
else:
    # load the existing index
    storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
    index = load_index_from_storage(storage_context)
    query_engine = index.as_query_engine(streaming=True)
    print("Using persistent")

print("Embedding complete")


def ask_llm(query):
    response = query_engine.query(query)
    return response.response_gen