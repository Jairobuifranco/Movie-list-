import {AgGridReact} from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-material.css"
import {useEffect, useMemo, useRef, useState} from "react";
import {fetchMovies} from "../services/api.js";
import {Link, useNavigate} from "react-router";
import "../css/Movies.css";

function Movies() {
    const navigate = useNavigate();
    const gridRef = useRef(null);
    const currentYear = new Date().getFullYear();
    const  yearOptions= [];
    const [selectedYear, setSelectedYear] = useState("");

    //Title filter
    const handleTitleChange = (value) =>{
        if (!gridRef.current) return;
        const api = gridRef.current.api;

        api.setColumnFilterModel("title", value
        ?{type: "contains", filter: value}
        :null
        );
        api.onFilterChanged()
    };

    //Year filter
    for (let y = currentYear; y >= 1990; y-- ) {
        yearOptions.push(y);
    }

    const handleYearChange = (value) => {
        if (!gridRef.current) return;
        const api = gridRef.current.api;

        api.setColumnFilterModel("year", value
            ? { type: "equals", filter: parseInt(value) }
            : null
        );
        api.onFilterChanged();

    };
    //Fetch data with infinate scrolling
    const dataSource = {
        getRows: async (params) => {
            const pageSize = params.endRow - params.startRow;
            const page = Math.floor(params.startRow / pageSize) + 1;
            console.log("AG Grid requested page:", page, "with size:", pageSize);

            try {
                const result = await fetchMovies(page, pageSize);
                params.successCallback(result.data, result.totalCount);

            }catch (error) {
                console.log("Loading page",error);
                params.failCallback()
            }
        }
    }

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            suppressHeaderMenuButton: true
        }
    })
    //Column Definition
    const [colDefs, setColDefs] = useState([
        {
            headerName: "Title",
            field: "title",
            filter: "agTextColumnFilter",
            suppressHeaderMenuButton: true,
            cellRendererFrameworks: (params) => (<Link to={`/movies/${params.data.imdbID}`}>{params.value}</Link>)
        },
        {headerName: "Year", field: "year", filter: true, suppressHeaderMenuButton: true},
        {headerName: "IMDb", field: "imdbRating", valueFormatter: (params) => (params.value ? params.value : "N/A")},
        {
            headerName: "Rotten Tomatoes",
            field: "rottenTomatoesRating",
            valueFormatter: (params) => (params.value ? params.value : "N/A")
        },
        {
            headerName: "Metacritic",
            field: "metacriticRating",
            valueFormatter: (params) => (params.value ? params.value : "N/A")
        },
        {
            headerName: "Cassification",
            field: "classification",
            valueFormatter: (params) => (params.value ? params.value : "N/A")
        }
    ]);

    //Displaying
    return (
        <>
            <div className="movies-filters">
                <input
                    className="form-control"
                    type="text"
                    placeholder="Search by title"
                    onChange={(e) => handleTitleChange(e.target.value)}
                    style={{ maxWidth: "300px", color: "#fff" }}
                />
                <select
                    className="form-select"
                    value={selectedYear}
                    onChange={(e) => {
                        setSelectedYear(e.target.value);
                        handleYearChange(e.target.value)}}
                    style={{ maxWidth: "200px" }}
                >
                    <option value="">All Years</option>
                    {yearOptions.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

            </div>

            <div className="ag-theme-material-dark" style={{height: "800px", width: '100%'}}>
            <AgGridReact
                domLayout="normal"
                ref={gridRef}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                datasource={dataSource}
                cacheBlockSize={100}
                maxBlocksInCache={5}
                rowModelType="infinite"
                suppressColumnVirtualisation={false}
                onRowClicked={(event) => {
                    const imdbID = event.data.imdbID;
                    navigate(`/movies/${imdbID}`);
                }}
            />
        </div>
        </>
    );
}

export default Movies;