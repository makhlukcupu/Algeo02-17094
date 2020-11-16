from init import app
from flask import request


@app.route('/')
def index():
    return app.meta


@app.route('/list')
def list_doc():
    return {
        "list": list((app.url).keys())
    }


@app.route('/doc')
def fetch_doc():
    name = request.args.get('name')
    for file in app.url:
        if name == file:
            return app.docs[file]


@app.route('/q')
def search():
    from preprocessing import weight_query
    from cosinesimilarity import calculate
    query = request.args.get('s')
    Q = weight_query(query, app.bow)
    rank = calculate(Q, app.D)

    return {
        "Q": Q,
        "D": app.D,
        "rank": {k: {
            "meta": app.meta[k],
            "similarity": v
        } for k, v in rank.items()}
    }

# @app.route('/upload', method=['POST'])
# def upload():
