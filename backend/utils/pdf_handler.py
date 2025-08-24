from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import re

class PdfHandler:
    def __init__(self, book_meta: dict):
        self._book_title = book_meta["title"]
        self._file_path = f"books/{book_meta['file_name']}"
        self._start_index = book_meta["relevant_start_page"]
        self._last_index = book_meta["relevant_last_page"]
  
    # Load PDF with LangChain
    def _load_pdf(self):
        loader = PyPDFLoader(self._file_path)
        documents = loader.load()
        return documents

    # Clean text (customizable per book)
    def _clean_text(self, text: str) -> str:
        # Remove multiple newlines
        text = re.sub(r"\n+", " ", text)
        # Remove excessive spaces
        text = re.sub(r"\s{2,}", " ", text)
        # Strip edges
        return text.strip()

    def _clean_documents(self, docs):
        new_docs = docs[self._start_index: self._last_index] if self._last_index < 0 else docs[self._start_index:]
        for doc in new_docs:
            doc.page_content = self._clean_text(doc.page_content)
        return new_docs

    # Chunk documents (preserve metadata)
    def chunk_documents(self, chunk_size=600, chunk_overlap=50) -> list:
        print(f"Loading {self._book_title} ......")
        pages = self._load_pdf()
        print("Cleaning pages data.....")
        docs = self._clean_documents(pages)

        print("Creating chunks of documents ....")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", " ", ""]
        )
        chunks = text_splitter.split_documents(docs)

        return chunks
