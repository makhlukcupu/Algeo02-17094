from flask import Flask
from flask_cors import CORS
import os
import glob
import re


class App(Flask):
    def run(self, host=None, port=None, debug=None, load_dotenv=True, **options):
        if not self.debug or os.getenv('WERKZEUG_RUN_MAIN') == 'true':
            with self.app_context():
                do_something()
        super(App, self).run(host=host, port=port,
                             debug=debug, load_dotenv=load_dotenv, **options)


app = App(__name__)
CORS(app)


def read_file(file):
    with app.open_resource(file, 'r') as fd:
        return fd.read()


def load_documents(folder_path):
    folder_path += "" if folder_path[-1] == "\\" else "\\"
    folder_path = app.instance_path + '\\..\\' + folder_path

    app.base_url = folder_path

    txt_files = glob.glob(folder_path + "*.txt")
    filenames = [os.path.basename(t) for t in txt_files]

    output_strings = map(read_file, sorted(txt_files))

    app.url = {k: v for k, v in zip(filenames, txt_files)}

    return {k: v for k, v in zip(filenames, output_strings)}


def do_something():
    from preprocessing import process

    documents = load_documents("static\docs")
    app.docs = documents

    app.meta = {k: {
        "first_sentence": re.sub('[^A-Za-z0-9]+', ' ', (v[:v.find('. ')])) + '.',
        "length": len(v)
    } for k, v in documents.items()}

    app.D, app.bow = process(documents)

    if len(app.D) > 0:
        print("Documents loaded")
    else:
        print("No documents loaded")


# if __name__ == "__main__":
app.run()
