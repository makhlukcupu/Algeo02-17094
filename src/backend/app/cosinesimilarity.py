
def panjang(D):
    panjangkuadrat = 0
    for word in (D):
        panjangkuadrat += D[word]**2
    return (panjangkuadrat**0.5)


def cosine_sim(Q, D):
    dotproduct = 0
    for word in (Q):
        dotproduct = dotproduct + Q[word]*D[word]

    if panjang(Q)*panjang(D) == 0:
        return 0

    return dotproduct/panjang(Q)*panjang(D)


def calculate(Q, D):
    distance = {}

    for k, weight in D.items():
        similarity = cosine_sim(Q, weight)
        # masukin ke list dengan kode dokumen i, dan nilai similarity a
        distance[k] = similarity

    result = dict(distance)

    return result


def main():
    D = {
        "name1.txt": {
            "im": 0.06462425227459469,
            "hungry": 0.06462425227459469,
            "dont": 0.06462425227459469,
            "anything": 0.06462425227459469,
            "eat": 0.06462425227459469,
            "something": 0.0,
            "make": 0.0,
            "starving": 0.0,
            "doesnt": 0.0,
            "want": 0.0,
            "give": 0.0,
            "maybe": 0.0,
            "die": 0.0,
            "world": 0.0,
            "much": 0.0,
            "better": 0.0,
            "place": 0.0,
        },
        "name2.txt": {
            "im": 0.0,
            "hungry": 0.0,
            "dont": 0.0,
            "anything": 0.0,
            "eat": 0.0,
            "something": 0.06462425227459469,
            "make": 0.06462425227459469,
            "starving": 0.06462425227459469,
            "doesnt": 0.06462425227459469,
            "want": 0.06462425227459469,
            "give": 0.06462425227459469,
            "maybe": 0.0,
            "die": 0.0,
            "world": 0.0,
            "much": 0.0,
            "better": 0.0,
            "place": 0.0,
        },
        "name3.txt": {
            "im": 0.0,
            "hungry": 0.0,
            "dont": 0.0,
            "anything": 0.0,
            "eat": 0.0,
            "something": 0.0,
            "make": 0.0,
            "starving": 0.0,
            "doesnt": 0.0,
            "want": 0.0,
            "give": 0.0,
            "maybe": 0.06462425227459469,
            "die": 0.06462425227459469,
            "world": 0.06462425227459469,
            "much": 0.06462425227459469,
            "better": 0.06462425227459469,
            "place": 0.06462425227459469,
        },
    }

    Q = {
        "im": 1,
        "hungry": 1,
        "dont": 0,
        "anything": 0,
        "eat": 0,
        "something": 0,
        "make": 0,
        "starving": 0,
        "doesnt": 0,
        "want": 0,
        "give": 0,
        "maybe": 0,
        "die": 0,
        "world": 0,
        "much": 0,
        "better": 0,
        "place": 0,
    }

    distance = {}

    for k, weight in D.items():
        similarity = cosine_sim(Q, weight)
        # masukin ke list dengan kode dokumen i, dan nilai similarity a
        distance[k] = similarity

    search_result = sorted(distance.items(), key=lambda x: x[1], reverse=True)

    print(search_result)


if __name__ == "__main__":
    main()
