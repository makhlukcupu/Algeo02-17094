import axiosInstance from "../helpers/axios"

const search = async (query) => {
    try {
        const { data } = await axiosInstance.get(
            `/q?s=${query}`
        )

        const rank = []

        for (const [k, e] of Object.entries(data.rank)) {
            const entry = {
                head: e.meta.first_sentence,
                length: e.meta.length,
                similarity: e.similarity,
                title: k
            }

            rank.push(entry)
        }

        return {
            D: data.D,
            Q: data.Q,
            rank
        }

    } catch (error) {
        console.error(error)
    }
}

const fetchDocument = async (name) => {
    try {
        const { data } = await axiosInstance.get(
            `/doc?name=${name}`
        )

        return data
    } catch (error) {
        console.error(error)
    }
}

const fetchList = async () => {
    try {
        const { data } = await axiosInstance.get(
            `/list`
        )

        return data.list
    } catch (error) {
        console.error(error)
    }
}

const searchController = {
    search,
    fetchDocument,
    fetchList
}

export default searchController