import {
  useState,
  useEffect
} from 'react'

import {
  searchController
} from "../../controllers"

import {
  Button,
  InputGroup,
  FormControl,
  Row,
  Col,
  Card,
  ListGroup,
  Pagination,
  Table,
  Modal,
  Tab,
  Nav
} from 'react-bootstrap'

import {
  FontAwesomeIcon
} from '@fortawesome/react-fontawesome'

import {
  faSearch,
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons'

import './style.scss';

const SearchBox = ({ query }) => {
  const [input, handleInput] = useState(query)

  useEffect(() => {
    if (query === null || query === "") document.getElementById("search-bar").focus()
  }, [query]);

  const handleKeyDown = (event) => {
    if (input !== "" && input !== null && event.key === 'Enter') {
      window.location = `/q?s=${input}`
    }
  }

  return (
    <InputGroup size="lg">
      <InputGroup.Prepend>
        <InputGroup.Text>
          <FontAwesomeIcon icon={faSearch} />
        </InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        id="search-bar"
        placeholder="Search"
        aria-label="Search"
        defaultValue={query}
        onChange={e => handleInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <InputGroup.Append>
        <Button href={input === null || input === "" ? null : `/q?s=${input}`}>Search</Button>
      </InputGroup.Append>
    </InputGroup>
  )
}

const Entry = ({ show, setShow, id, setId }) => {
  const [content, setContent] = useState("");

  const handleClose = () => {
    setId("")
    setContent("")
    setShow(false);
  }

  useEffect(() => {
    const fetchResults = async () => {
      const result = await searchController.fetchDocument(id)
      setContent(result)
    }

    fetchResults()
  }, [id]);

  return (
    <Modal size="lg" show={show} onHide={handleClose} >
      <Modal.Header closeButton>
        <Modal.Title>{id === "" ? <FontAwesomeIcon icon={faCircleNotch} style={{ color: "grey" }} spin /> : id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{content === "" ? <FontAwesomeIcon icon={faCircleNotch} style={{ color: "grey" }} spin /> : content}</Modal.Body>
    </Modal>
  )
}

const Results = ({ results, loading }) => {
  const perPage = 5
  const [page, setPage] = useState(1)
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");

  const handleShow = () => setShow(true);

  let items = [
    <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />,
    <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 1} />,
  ];

  for (let number = 1; number <= Math.ceil(results.length / perPage); number++) {
    items.push(
      <Pagination.Item key={number} active={number === page} onClick={() => setPage(number)}>
        {number}
      </Pagination.Item>,
    );
  }

  items.push([
    <Pagination.Next onClick={() => setPage(page + 1)} disabled={page === Math.ceil(results.length / perPage)} />,
    <Pagination.Last onClick={() => setPage(Math.ceil(results.length / perPage))} disabled={page === Math.ceil(results.length / perPage)} />
  ])

  const handleEntry = (id) => {
    setTitle(id)
    handleShow()
  }

  return (
    <>
      <div className="results">
        {
          !loading && results.length > 0 ? (
            <>
              <h6 style={{ color: 'grey' }}>Hasil Pencarian: (diurutkan dari tingkat kemiripan tertinggi)</h6>
              <br />
            </>
          ) : null
        }
        <ListGroup>
          {
            loading ? (
              <div style={{ textAlign: "center" }}>
                <FontAwesomeIcon size="lg" icon={faCircleNotch} style={{ color: "grey" }} spin />
              </div>
            ) : (
                results.length > 0 ? (
                  results.slice(0 + perPage * (page - 1), perPage + perPage * (page - 1)).map(res => (
                    <ListGroup.Item key={res.title} action style={{ padding: '2em 1em' }} onClick={() => handleEntry(res.title)}>
                      <h5>{res.title}</h5>
                      <span><strong>Jumlah kata</strong>: {res.length}</span>
                      <br />
                      <p><strong>Tingkat kemiripan</strong>: {(res.similarity * 100).toFixed(5)}%</p>
                      <span>{res.head}</span>
                    </ListGroup.Item>
                  ))
                ) : (
                    <p>Tidak ditemukan hasil yang sesuai.</p>
                  ))
          }
        </ListGroup>
        <br />
        {
          !loading && results.length > 0 ? (
            <Pagination style={{ justifyContent: "center" }}>
              {items}
            </Pagination>
          ) : null
        }
      </div>
      <Entry show={show} setShow={setShow} id={title} setId={setTitle} />
    </>
  )
}

const TableCalc = ({ vectors }) => {
  if (vectors !== null && vectors !== undefined) {
    const { Q, D } = vectors

    const cols = Object.keys(Q)
    const rows = Object.keys(D)

    return (
      <>
        <h6>Tabel kata & kemunculan dalam setiap dokumen.</h6>
        <p><i>Dikali 1000 (‰)</i></p>
        <br />
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              {cols.map((word, i) => (
                <th key={i}>{word}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {
              rows.map((name, i) => (
                <tr key={i}>
                  <td><i><b>{name}</b></i></td>
                  {
                    (Object.values(D[name])).map((e, j) => (
                      <td key={j}>{e === 0 ? 0 : (e * 1000).toFixed(5)}</td>
                    ))
                  }
                </tr>
              ))
            }
          </tbody>
        </Table>
        <br />
      </>
    )
  } else return null
}

const Lister = () => {
  const [list, setList] = useState([])
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");

  const handleShow = () => setShow(true);
  const handleEntry = (id) => {
    setTitle(id)
    handleShow()
  }

  useEffect(() => {
    const fetchList = async () => {
      const result = await searchController.fetchList()
      setList(result)
    }

    fetchList()
  }, []);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Daftar Dokumen</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Tambahkan dengan mengupload</Card.Subtitle>
      </Card.Header>
      <ListGroup defaultActiveKey="#link1" variant="flush">
        {
          list.map((e, i) => (
            <ListGroup.Item key={i} action onClick={() => handleEntry(e)}>
              {e}
            </ListGroup.Item>
          ))
        }
      </ListGroup>
      <Entry show={show} setShow={setShow} id={title} setId={setTitle} />
    </Card>
  )
}

const About = ({ show, setShow }) => {
  const handleClose = () => {
    setShow(false);
  }

  return (
    <Modal size="lg" show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>About</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Prototype mesin pencarian menggunakan <i>cosine similarity</i>, oleh:
          <br />
          1. Harry Prabowo (13517094)
          <br />
          2. Alvin Rizqi Alfisyahrin (13519126)
          <br />
          3. La Ode Rajuh Emoko (13519170)

          <hr />

          <h6>Konsep singkat</h6>
          Ide utama dari sistem temu balik informasi adalah mengubah search query menjadi ruang vektor Setiap dokumen maupun query dinyatakan sebagai vektor <code>w = (w1, w2,..., wn)</code> di dalam Rn ,
          dimana nilai wi dapat menyatakan jumlah kemunculan kata tersebut dalam dokumen (term frequency).
          Penentuan dokumen mana yang relevan dengan search query dipandang sebagai pengukuran kesamaan (similarity measure) antara query dengan dokumen.
          Semakin sama suatu vektor dokumen dengan vektor query, semakin relevan dokumen tersebut dengan query.
          Kesamaan tersebut dapat diukur dengan cosine similarity dengan rumus:
          <br />
          <br />

          <code>similarity(Q, D) = cos(theta) = (Q . D)/||Q||*||D||</code>

          <br />
          <br />
          Jika cos theta = 1, berarti theta = 0, vektor Q dan D berimpit, yang berarti dokumen D sesuai dengan query Q.
          Jadi, nilai cosinus yang besar (mendekati 1) mengindikasikan bahwa dokumen cenderung sesuai dengan query.
          Setiap dokumen di dalam koleksi dokumen dihitung kesamaannya dengan query dengan rumus cosinus di atas.
          Selanjutnya hasil perhitungan di-ranking berdasarkan nilai cosinus dari besar ke kecil sebagai proses pemilihan dokumen yang yang “dekat” dengan query.
          </p>
      </Modal.Body>
    </Modal>
  )
}

const App = () => {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const query = params.get('s');

  const [show, setShow] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [vectors, setVectors] = useState()


  useEffect(() => {
    setLoading(true)
    if (query !== null && query !== "") {
      const fetchResults = async () => {
        const result = await searchController.search(query)

        if (result !== undefined && result !== null) {
          result.rank.sort((a, b) => (a.similarity > b.similarity) ? -1 : ((b.similarity > a.similarity) ? 1 : 0));
          setResults(result.rank.filter(e => e.similarity > 0))
          setVectors({
            Q: result.Q,
            D: result.D
          })
        }

        setLoading(false)
      }

      fetchResults()
    }
  }, [query]);

  return (
    <div className="App">
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <header>
          <Row>
            <Col md={8} lg={6} xl={5} style={{ marginLeft: '2em' }}>
              <SearchBox query={query} />
            </Col>
          </Row>
          <Row>
            <Col style={{ padding: '0' }}>
              <Nav variant="tabs" style={{ margin: '1em 0 -1em 3em' }}>
                <Nav.Item>
                  <Nav.Link eventKey="first">Results</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Vectors</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>
        </header>

        <main>
          <Row>
            <Col md={7} style={{ marginLeft: '2em' }}>
              <br />
              {query === null || query === "" ? null : (
                <>
                  <Tab.Content>
                    <Tab.Pane eventKey="first">
                      <Results loading={loading} results={results} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <TableCalc vectors={vectors} />
                    </Tab.Pane>
                  </Tab.Content>
                </>
              )}
            </Col>
            <Col />
            <br />
            <Col xs={0} md={4} lg={3} style={{ margin: '1em 2em' }}>
              <Lister />
            </Col>
          </Row>
        </main>
      </Tab.Container>
      <br />

      <footer>
        <Button variant="link" onClick={() => setShow(true)}><h6>Perihal</h6></Button>
      </footer>

      <About show={show} setShow={setShow} />
    </div >
  );
}

export default App;
