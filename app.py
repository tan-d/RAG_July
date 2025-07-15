import os
from dotenv import load_dotenv
from openai import OpenAI
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
import faiss
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.vectorstores import FAISS
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document

# Load environment variables from .env file
load_dotenv()

openai_key = os.getenv("OPENAI_API_KEY")
if not openai_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables. Please check your .env file.")

 
# Initialize the Faiss vector store
# Path to save/load the FAISS index
faiss_path = r"C:\Users\Tanya\Desktop\RAG3\faiss_index"

embedding_dim = 1536  # For OpenAI's text-embedding-ada-002

# Try to load existing FAISS index, otherwise create a new one
if os.path.exists(faiss_path):
    vector_store = FAISS.load_local(
        faiss_path,
        embeddings=OpenAIEmbeddings(openai_api_key=openai_key),
        allow_dangerous_deserialization=True,
    )
else:
    openai_ef = OpenAIEmbeddings(openai_api_key=openai_key)
    vector_store = FAISS(
        embedding_function=openai_ef,
        index=faiss.IndexFlatL2(embedding_dim),
        docstore=InMemoryDocstore(),
        index_to_docstore_id={}, 
    )
# To save the FAISS index after adding documents:
vector_store.save_local(faiss_path)
# To save the FAISS index after adding documents:
vector_store.save_local(faiss_path)

client = OpenAI(api_key=openai_key)
#+/client.chat.completions.create(
     #model="gpt-3.5-turbo",
    #messages=[
        # {"role": "system", "content": "You are a helpful assistant."},
         #{
            # "role": "user",
           # "content": "What is human life expectancy in the United States?",
        # },
 #   ],
 #)

#print(resp)- to print the response from OpenAI use resp.client.chat.completions.create

# Function to load documents from a directory
def load_documents_from_directory(directory_path):
    print("==== Loading documents from directory ====")
    documents = []
    for filename in os.listdir(directory_path):
        if filename.endswith(".txt"):
            with open(
                os.path.join(directory_path, filename), "r", encoding="utf-8"
            ) as file:
                documents.append({"id": filename, "text": file.read()})
    return documents


# Function to split text into chunks
def split_text(text, chunk_size=1000, chunk_overlap=20):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - chunk_overlap
    return chunks


# Load documents from the directory
directory_path = "./dataset"
documents = load_documents_from_directory(directory_path)

print(f"Loaded {len(documents)} documents")

# Split documents into chunks
chunked_documents = []
for doc in documents:
    chunks = split_text(doc["text"])
    print("==== Splitting docs into chunks ====")
    for i, chunk in enumerate(chunks):
        chunked_documents.append({"id": f"{doc['id']}_chunk{i+1}", "text": chunk})

# print(f"Split documents into {len(chunked_documents)} chunks")
# Function to generate embeddings using OpenAI API
def get_openai_embedding(text):
    response = client.embeddings.create(input=text, model="text-embedding-3-small")
    embedding = response.data[0].embedding
    print("==== Generating embeddings... ====")
    return embedding


# Generate embeddings for the document chunks
docs = [
    Document(page_content=doc["text"], metadata={"id": doc["id"]})
    for doc in chunked_documents
]
for doc in chunked_documents:
    print("==== Generating embeddings... ====")
    doc["embedding"] = get_openai_embedding(doc["text"])


#print(doc["embedding"])
#Add documents to the FAISS vector store
vector_store.add_documents(docs)
# Upsert documents with embeddings into Faiss vector store
for doc in chunked_documents:
    print("==== Inserting chunks into db;;; ====")
    vector_store.add_texts(
        texts=[doc["text"]],
        metadatas=[{"id": doc["id"]}],
        embeddings=[doc["embedding"]],
    )
# Save the FAISS index after adding documents
vector_store.save_local(faiss_path)

# Function to query documents using FAISS
def query_documents(question, n_results=2):
    # This will use the embedding function you provided to FAISS
    results = vector_store.similarity_search(question, k=n_results)
    # Extract the relevant chunks (page_content)
    relevant_chunks = [doc.page_content for doc in results]
    print("==== Returning relevant chunks ====")
    return relevant_chunks

    # for idx, document in enumerate(results["documents"][0]):
    #     doc_id = results["ids"][0][idx]
    #     distance = results["distances"][0][idx]
    #     print(f"Found document chunk: {document} (ID: {doc_id}, Distance: {distance})")


# Function to generate a response from OpenAI
def generate_response(question, relevant_chunks):
    context = "\n\n".join(relevant_chunks)
    prompt = (
        "You are an assistant for question-answering tasks. Use the following pieces of "
        "retrieved context to answer the question. If you don't know the answer, say that you "
        "don't know. Use three sentences maximum and keep the answer concise."
        "\n\nContext:\n" + context + "\n\nQuestion:\n" + question
    )

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": prompt,
            },
            {
                "role": "user",
                "content": question,
            },
        ],
    )

    answer = response.choices[0].message
    return answer


# Example query
# query_documents("tell me about AI replacing TV writers strike.")
# Example query and response generation
question = "tell me about databricks"
relevant_chunks = query_documents(question)
answer = generate_response(question, relevant_chunks)

print(answer)
 