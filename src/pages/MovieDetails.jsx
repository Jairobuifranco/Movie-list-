import {AgGridReact} from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-material.css"
import {useEffect, useMemo, useState} from "react";
import {fetchMovieData} from "../services/api.js";
import {Link, useNavigate, useParams} from "react-router";
import "../css/MovieDetails.css"



function MovieDetails() {
    const [rowData, setRowData] = useState([]);
    const navigate = useNavigate();
    const {id} = useParams();
    const [details, setDetails] = useState([null]);



    useEffect(() => {
        //Fetch data fo Grid
        const loadData = async () => {
            try {
                console.log("Fetching Movies", id);
                const data = await fetchMovieData(id);
                console.log("Movie data received", data);
                setDetails(data);
                setRowData(data.principals.map(p => ({
                    id: p.id,
                    role: p.category,
                    name: p.name,
                    character: p.characters?.[0] || "N/A",
                })));
            } catch (error) {
                console.log(error);
            }
        };
        loadData();
    }, [id]);
    if (!details) return <div>Loading...</div>;


    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
        }
    })

    const [colDefs, setColDefs] = useState([
        {headerName: "Role", field: "role"},
        {
            headerName: "Name",
            field: "name",
            cellRendererFrameworks: (params) => (<Link to={`/people/${params.data.id}`}>{params.value}</Link>)
        },
        {headerName: "Character", field: "character"},
    ]);

    return (

            <div className= "container-fluid movie-details-page bg-dark text-light py-4" >
            <div className="row" >
                <div className="col-md-5 mb-4">
                <h1>{details.title}</h1>
                <img src={details.poster} alt={"poster"} width={"300"}/>
                <p><strong>Year:</strong> {details.year}</p>
                <p><strong>Run time:</strong> {details.runtime} minutes</p>
                <p><strong>Genres:</strong> {details.genres}</p>
                <p><strong>Country:</strong> {details.country}</p>
                <p><strong>Box Office:</strong> {details.boxoffice}</p>
                <p><strong> {details.plot}</strong></p>
                </div>

            <div className= "col-md-7">
                <h2 className="mb-3">Credits</h2>
                <div className="ag-theme-material-dark rounded" style={{height: "550px", width: '100%'}}>
                <AgGridReact
                    domLayout="autoHeight"
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    onRowClicked={(event) => {
                        const id = event.data.id;
                        navigate(`/people/${id}`);
                    }}
                />
            </div>
            </div>
            </div>
            </div>
    )
}
export default MovieDetails;