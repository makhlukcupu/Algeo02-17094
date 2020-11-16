const About = () => {
    return (
        <div>
            <p>
                Prototype mesin pencarian menggunakan cosine similarity, oleh:
                1. Harry Prabowo ( 13517094 )
                2. Alvin Rizqi Alfisyahrin ( 13519126 )
                3. La Ode Rajuh Emoko ( 13519170 )



                Konsep singkat
                Ide utama dari sistem temu balik informasi adalah mengubah search query menjadi ruang vektor Setiap dokumen maupun query dinyatakan sebagai vektor w = (w1, w2,..., wn) di dalam Rn ,
                dimana nilai wi dapat menyatakan jumlah kemunculan kata tersebut dalam dokumen (term frequency).
                Penentuan dokumen mana yang relevan dengan search query dipandang sebagai pengukuran kesamaan (similarity measure) antara query dengan dokumen.
                Semakin sama suatu vektor dokumen dengan vektor query, semakin relevan dokumen tersebut dengan query.
                Kesamaan tersebut dapat diukur dengan cosine similarity dengan rumus:

                similarity(Q, D) = cos(theta) = (Q . D)/||Q||*||D||

                Jika cos theta = 1, berarti theta = 0, vektor Q dan D berimpit, yang berarti dokumen D sesuai dengan query Q.
                Jadi, nilai cosinus yang besar (mendekati 1) mengindikasikan bahwa dokumen cenderung sesuai dengan query.
                Setiap dokumen di dalam koleksi dokumen dihitung kesamaannya dengan query dengan rumus cosinus di atas.
                Selanjutnya hasil perhitungan di-ranking berdasarkan nilai cosinus dari besar ke kecil sebagai proses pemilihan dokumen yang yang “dekat” dengan query.
            </p>
        </div>
    )
}

export default About