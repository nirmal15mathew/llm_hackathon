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
Settings.llm = Ollama(model="mistral", request_timeout=360.0)
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
    query_engine = index.as_query_engine(streaming=True)
else:
    # load the existing index
    storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
    index = load_index_from_storage(storage_context)
    # query_engine = index.as_query_engine(streaming=True)
    print("Using persistent")

print("Embedding complete")

def update_context_files():
    documents = SimpleDirectoryReader("data").load_data()
    print("Loaded documents")
    index = VectorStoreIndex.from_documents(documents,show_progress=True)


def ask_llm(query):
    response = query_engine.query(query)
    return response.response_gen

# if __name__ == "__main__":
#     input_q = input("Ask mistral: ")
#     resp = query_engine.query(input_q)
#     resp.print_response_stream()
    

from llama_index.core.query_engine import CustomQueryEngine
from llama_index.core.retrievers import BaseRetriever
from llama_index.core import get_response_synthesizer
from llama_index.core.response_synthesizers import BaseSynthesizer
from llama_index.core import PromptTemplate


custom_prompt_template = PromptTemplate(
    "Context information is below.\n"
    "---------------------\n"
    "{context_str}\n"
    "---------------------\n"
    "Given the context information and not prior knowledge, "
    "answer the query. Answers must be in long form and has to be in the form of an answer written in an exam.\n"
    "Query: {query_str}\n"
    "Answer: "
)

## Implementing custom query engine

class RAGStringQueryEngine(CustomQueryEngine):

    retriever: BaseRetriever
    response_synthesizer: BaseSynthesizer
    llm: Ollama
    qa_prompt: PromptTemplate

    def custom_query(self, query_str: str):
        nodes = self.retriever.retrieve(query_str)

        context_str = "\n\n".join([n.node.get_content() for n in nodes])
        response = self.llm.complete(
            self.qa_prompt.format(context_str=context_str, query_str=query_str)
        )

        return response


synthesizer = get_response_synthesizer(response_mode="compact")
retriever = index.as_retriever()
query_engine_custom = RAGStringQueryEngine(
    retriever=retriever,
    llm=Settings.llm,
    response_synthesizer=synthesizer,
    qa_prompt=custom_prompt_template
)

if __name__ == "__main__":
    input_q = input("Ask mistral: ")
    resp = query_engine_custom.query(input_q)
    print(str(resp))