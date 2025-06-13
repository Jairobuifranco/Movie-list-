import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { fetchPerson } from "../services/api.js";
import "../css/Person.css";
import { AgCharts } from "ag-charts-react";

function Person() {
    const [rowData, setRowData] = useState([]);
    const [person, setPerson] = useState(null);
    const [chartOptions, setChartOptions] = useState({
        title: { text: "IMDb Ratings", fontSize: 18 },
        data: [],
        series: [],
        axes: [],
        background: { fill: "#1e1e1e" },
    });
    const { id } = useParams();
    const [unauthorized, setUnauthorized] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const defaultColDef = useMemo(() => ({ flex: 1 }), []);

    const [colDefs] = useState([
        { headerName: "Role", field: "role" },
        { headerName: "Movie", field: "movie" },
        { headerName: "Character", field: "character" },
        { headerName: "Rating", field: "rating" },
    ]);
    //Fetc data
    useEffect(() => {
        const loadData = async () => {
            if (!token) {
                setUnauthorized(true);
                return;
            }
            try {
                const data = await fetchPerson(id, token);
                setPerson(data);
                setRowData(
                    data.roles.map(p => ({
                        role: p.category,
                        movie: p.movieName,
                        character: p.characters?.[0] || "N/A",
                        rating: p.imdbRating,
                    }))
                );
                //Chart data
                setChartOptions({
                    title: {
                        text: `IMDb Ratings for ${data?.name || "N/A"}`,
                        fontSize: 20,
                        color: "#f0f0f0",
                    },
                    background: { fill: "#1e1e1e" },
                    data: data?.roles?.map(r => ({
                        movieName: r.movieName,
                        imdbRating: parseFloat(r.imdbRating),
                    })) || [],
                    series: [
                        {
                            type: "bar",
                            xKey: "movieName",
                            yKey: "imdbRating",
                            yName: "IMDb Rating",
                            fill: "#0d6efd",
                            stroke: "#0a58ca",
                            label: {
                                enabled: true,
                                color: "#ffffff",
                                fontWeight: "bold",
                            },
                        },
                    ],
                    axes: [
                        {
                            type: "category",
                            position: "bottom",
                            title: { text: "Movie", color: "#f0f0f0" },
                            label: {
                                rotation: -45,
                                color: "#f0f0f0",
                                wrapping: 'character',
                                maxWidth: 80,
                                overflow: 'hidden',
                            },
                        },
                        {
                            type: "number",
                            position: "left",
                            title: { text: "Rating", color: "#f0f0f0" },
                            label: { color: "#f0f0f0" },
                            min: 0,
                            max: 10,
                            tickCount: 11,
                            tickFormat: 'd',
                            tickInterval: 1,
                        },
                    ],
                    legend: { enabled: false },
                });
            } catch (error) {
                if (error.message === "Unauthorized") {
                    setUnauthorized(true);
                }
                console.error("Error fetching person data:", error);
            }
        };
        loadData();
    }, [id, token]);

    if (unauthorized) {
        return (
            <div className="unauthorized">
                <h2>You must be logged in to view this page.</h2>
                <p>Please <a href="/login">Login</a> to continue</p>
            </div>
        );
    }
    if (!person) return <div>Loading...</div>;

    return (
        <div className="person-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div className="person-page-header mb-3" style={{ width: '100%' }}>
                <h1>{person.name}</h1>
                <h2>{person.birthYear}-{person.deathYear || "Present"}</h2>
            </div>

            <div style={{ display: 'flex', width: '80%', maxWidth: '1200px' }}>
                <div className="person-ag-grid-container" style={{ width: '700px', minWidth: '700px', marginRight: '2rem', height: '400px', minHeight: '400px' }}>
                    <div className="ag-theme-material-dark" style={{ height: '100%', width: '100%' }}>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={colDefs}
                            domLayout="autoHeight"
                            defaultColDef={defaultColDef}
                        />
                    </div>
                </div>
                <div className="person-ag-charts-container" style={{ width: '700px', minWidth: '700px', height: '300px', minHeight: '300px' }}>
                    <div className="ag-charts-component" style={{ height: '100%', width: '100%' }}>
                        <AgCharts options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Person;