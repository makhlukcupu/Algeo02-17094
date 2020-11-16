import nltk
import re
import math
import string
import collections
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords


#----------- MAIN PREPROCESSING PROGRAM -----------#

def preprocess(documents):
    preprocessed_text = [clean(s) for s in documents]
    tokens_list = [tokenize_and_remove_stopwords(s) for s in preprocessed_text]
    new_words = [lemmatization(tokens) for tokens in tokens_list]
    return new_words


def clean(document):
    result = remove_punctuation(remove_numbers(
        lowercase(remove_whitespace(document))))
    return result


def lowercase(text):
    return text.lower()


def remove_numbers(text):
    return re.sub(r'\d+', '', text)


def remove_punctuation(text):
    return "".join([char.lower() for char in text if char not in string.punctuation])


def remove_whitespace(text):
    return re.sub('\s+', ' ', text).strip()


#------------------- TOKENIZING -------------------#

def tokenize_and_remove_stopwords(text):
    tokens = nltk.tokenize.word_tokenize(text)
    stopword_list = set(stopwords.words('english'))
    removed = []
    for t in tokens:
        if t not in stopword_list:
            removed.append(t)
    return removed


def lemmatization(tokens):
    lemmatizer = WordNetLemmatizer()
    lemmas = []
    for word in tokens:
        lemma = lemmatizer.lemmatize(word)
        lemmas.append(lemma)
    return lemmas


#------------------- VECTORIZATION -------------------#

def weight(documents, bow):
    tf = {}
    documents_dict = {}

    for k, document in documents.items():
        word_dict = get_dict(document, bow.keys())
        documents_dict[k] = word_dict
        tf[k] = term_frequency(word_dict)

    idf = inverse_document_frequency(documents_dict, bow)

    tfidf = {}
    for k, v in tf.items():
        tfidf[k] = compute_tfidf(v, idf)

    return tfidf


def term_frequency(word_dict):
    tf_dict = {}
    N = len(word_dict)

    for word, count in word_dict.items():
        tf_dict[word] = count/float(N)

    return tf_dict


def inverse_document_frequency(documents, bow):
    N = len(documents)
    idf_dict = dict.fromkeys(bow.keys(), 0)

    for doc in documents.values():
        for word, val in doc.items():
            if val > 0:
                idf_dict[word] += 1

    for word, val in idf_dict.items():
        idf_dict[word] = math.log(N / float(val))

    return idf_dict


def compute_tfidf(tf, idf):
    weight = {}
    for word, val in tf.items():
        weight[word] = val * idf[word]
    return weight


def get_dict(document, unique_words):
    word_count = dict.fromkeys(unique_words, 0)

    for word in set(document):
        word_count[word] += 1

    return word_count


def get_bow(documents):
    bow = []
    for doc in documents:
        bow += doc
    return collections.Counter(bow)


def weight_query(query, unique_words):
    Q = dict.fromkeys(unique_words, 0)
    query = tokenize_and_remove_stopwords(query)
    query = collections.Counter(query)

    for word, count in query.items():
        if(word in Q):
            Q[word] = count

    return Q


def process(documents):
    preprocessed_docs = {k: v for k, v in zip(
        documents.keys(), preprocess(documents.values()))}

    bow = get_bow(preprocessed_docs.values())

    return weight(preprocessed_docs, bow), bow


def main():
    documents = {
        "name1.txt": "I'm very hungry, i don't have anything to eat",
        "name2.txt": "she has something that can make me not starving, but she doesn't want to give it to me",
        "name3.txt": "maybe if i die, the world can be a much better place"
    }

    preprocessed_docs = {k: v for k, v in zip(
        documents.keys(), preprocess(documents.values()))}

    bow = get_bow(preprocessed_docs.values())

    D = weight(preprocessed_docs, bow)

    print(D)

    query = input("masukkan query: ")
    Q = weight_query(query, bow)

    print(Q)


if __name__ == "__main__":
    main()
