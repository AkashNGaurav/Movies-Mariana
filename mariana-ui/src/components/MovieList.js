import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { Avatar } from "@mui/material";
import SearchAppBar from "./NavBar";

export default function MovieList() {
  //   state = {
  //     movies: []
  //   }

  const [movies, setMovies] = useState([]);
  const [genreName, setGenreName] = React.useState([]);
  const [searchkeyword, setSearchkeyword] = React.useState("");

  useEffect(() => {
    console.log(genreName);
    async function fetchFilterData() {
      const response = await axios.post(
        `http://localhost:5000/get-filter-genre`,
        { genreName }
      );
      console.log(response.data);
      setMovies(response.data);
    }
    fetchFilterData();
    console.log("movies: ", movies);
  }, [genreName]);

  useEffect(() => {
    console.log(searchkeyword);
    async function fetchTextFilterData() {
      const response = await axios.post(
        `http://localhost:5000/get-search_result`,
        { searchkeyword }
      );
      console.log(response.data);
      setMovies(response.data);
    }
    fetchTextFilterData();
    console.log("movies: ", movies);
  }, [searchkeyword]);

  const handleTextChange = (event) => {
    setGenreName([]);
    setSearchkeyword(event.target.value);
    console.log(genreName);
  };

  const handleChange = (event) => {
    setSearchkeyword("");
    setGenreName(event.target.value);
    console.log(genreName);
  };

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        `http://localhost:5000/get-movie-details`
      );
      console.log(response);
      setMovies(response.data);
    }
    fetchData();
  }, []);

  return (
    <>
      <SearchAppBar
        handleChange={handleChange}
        handleTextChange={handleTextChange}
        genreName={genreName}
      />
      <Container fixed sx={{ margin: 5 }}>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650 }}
            size="small"
            aria-label="movie table"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <TableCell>Title </TableCell>
                <TableCell align="left">Poster</TableCell>
                <TableCell align="right">Rating</TableCell>
                <TableCell align="right">Genres</TableCell>
                <TableCell align="right">Metacritic(out of 100)</TableCell>
                <TableCell align="right">Released year</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movies.map((row) => (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell>
                    <Avatar
                      alt="Remy Sharp"
                      src={row.poster}
                      sx={{ width: 56, height: 56 }}
                    />
                  </TableCell>
                  <TableCell align="right">{row.rating}</TableCell>
                  <TableCell align="right">{row.genre}</TableCell>
                  <TableCell align="right">{row.metacritic}</TableCell>
                  <TableCell align="right">{row.released_year}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
