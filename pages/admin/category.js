import React from "react";
import { useState, useEffect } from "react";
import DashTheme from "./Component/DashTheme";
import {
  Box,
  FormControlLabel,
  Switch,
  Grid,
  Button,
  Autocomplete,
  TextField,
  Dialog,
  DialogTitle,
  IconButton,
  DialogActions,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Input,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1976d2",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Category = () => {
  let router = useRouter();

  const [allData, setAllData] = useState([]);
  const [opencategory, setOpencategory] = useState(false);
  const [selectcategories, setselectcategories] = useState("");
  const [uid, setUid] = useState(null);
  const filterCategories = allData
    ? allData.filter((el) =>
        selectcategories ? el.categoryName === selectcategories : true
      )
    : [];
  const [allSubCategoryData, setAllSubCategoryData] = useState([]);
  let allSubCategoryDataCallApi = async () => {
    try {
      let res = await axios.get(`${process.env.BASE_URL}subcategory`, {
        headers: {
          Authorization: localStorage.getItem("Admin_Token"),
        },
      });

      setAllSubCategoryData(res.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const statusChange = async (id) => {
    try {
      let findData = allData.find((el) => el._id === id);
      let data = findData.status === "on" ? "off" : "on";
      let dataSet = { status: data };
      if (data === "off") {
        let subCategoryDateShortingOff = allSubCategoryData.filter(
          (el) => el.categoryID._id === id
        );
        for (const el of subCategoryDateShortingOff) {
          try {
            let res = await axios.patch(
              `${process.env.BASE_URL}subcategory/${el._id}`,
              { status: "off" },
              {
                headers: {
                  Authorization: localStorage.getItem("Admin_Token"),
                },
              }
            );
          } catch (error) {
            console.log(error.message);
          }
        }
      } else {
        let subCategoryDateShortingOff = allSubCategoryData.filter(
          (el) => el.categoryID._id === id
        );
        for (const el of subCategoryDateShortingOff) {
          let res = await axios.patch(
            `${process.env.BASE_URL}subcategory/${el._id}`,
            { status: "on" },
            {
              headers: {
                Authorization: localStorage.getItem("Admin_Token"),
              },
            }
          );
        }
      }
      let res = await axios.patch(
        `${process.env.BASE_URL}category/${id}`,
        dataSet,
        {
          headers: {
            Authorization: localStorage.getItem("Admin_Token"),
          },
        }
      );
      allDataCallApi();
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleClickOpencategory = () => {
    setOpencategory(true);
  };
  const handleClose = () => {
    setOpencategory(false);
  };

  const formik = useFormik({
    initialValues: {
      categoryName: "",
    },
    onSubmit: async (values) => {
      try {
        if (uid && uid.length) {
          let res = await axios.patch(
            `${process.env.BASE_URL}category/${uid}`,
            values,
            {
              headers: {
                Authorization: localStorage.getItem("Admin_Token"),
              },
            }
          );
          setUid(null);
        } else {
          let res = await axios.post(
            `${process.env.BASE_URL}category/create`,
            values,
            {
              headers: {
                Authorization: localStorage.getItem("Admin_Token"),
              },
            }
          );
        }
        handleClose();
        allDataCallApi();
        formik.resetForm();
      } catch (error) {
        console.log(error.message);
      }
    },
  });

  let allDataCallApi = async () => {
    try {
      let res = await axios.get(`${process.env.BASE_URL}category`, {
        headers: {
          Authorization: localStorage.getItem("Admin_Token"),
        },
      });
      setAllData(res.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  let DeleteCategory = async (id) => {
    try {
      let res = await axios.delete(`${process.env.BASE_URL}category/${id}`, {
        headers: {
          Authorization: localStorage.getItem("Admin_Token"),
        },
      });
      allDataCallApi();
    } catch (error) {
      console.log(error.message);
    }
  };

  let UpdateCategory = (id) => {
    handleClickOpencategory();
    let findData = allData.find((el) => el._id === id);
    formik.setFieldValue("categoryName", findData?.categoryName);
    setUid(id);
  };
  useEffect(() => {
    let Admin_Token = localStorage.getItem("Admin_Token");
    if (!Admin_Token) {
      router.push("/admin/login");
    }
    allDataCallApi();
    allSubCategoryDataCallApi();
  }, [router]);
  return (
    <DashTheme>
      <Box>
        <Box sx={{ marginBottom: "15px" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} columns={{ xs: 4, lg: 12 }}>
              <Grid item xs={6} md={10}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={allData ? allData.map((el) => el.categoryName) : []}
                  renderInput={(params) => (
                    <TextField
                      type="text"
                      {...params}
                      label="Search Category"
                      onSelect={(e) => setselectcategories(e.target.value)}
                      onInput={(e) => setselectcategories(e.target.value)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <Button
                  variant="contained"
                  sx={{ width: "100%", padding: "15px 20px" }}
                  onClick={handleClickOpencategory}
                >
                  Add Category
                </Button>
                <BootstrapDialog
                  onClose={handleClose}
                  aria-labelledby="customized-dialog-title"
                  open={opencategory}
                >
                  <form onSubmit={formik.handleSubmit}>
                    <DialogTitle
                      sx={{ m: 0, p: 2 }}
                      id="customized-dialog-title"
                    >
                      Add Catagory
                    </DialogTitle>
                    <IconButton
                      aria-label="close"
                      onClick={handleClose}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                      <Box sx={{ width: "100%", marginBottom: "15px" }}>
                        <TextField
                          id="categoryName"
                          name="categoryName"
                          type="text"
                          label="Category"
                          variant="outlined"
                          onChange={formik.handleChange}
                          value={formik.values.categoryName}
                        />
                      </Box>
                    </DialogContent>
                    <DialogActions>
                      <Button variant="contained" type="submit">
                        Submit
                      </Button>
                    </DialogActions>
                  </form>
                </BootstrapDialog>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box>
          <TableContainer
            sx={{ borderRadius: "3px", border: "1px solid #ccc" }}
          >
            <Table sx={{ minWidth: 300 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>No</StyledTableCell>
                  <StyledTableCell>Catagory Name</StyledTableCell>
                  <StyledTableCell align="right" sx={{ paddingRight: "40px" }}>
                    Status
                  </StyledTableCell>
                  <StyledTableCell align="right">Delete</StyledTableCell>
                  <StyledTableCell align="right">Update</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterCategories.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell component="th" scope="row">
                      {i + 1}
                    </StyledTableCell>
                    <StyledTableCell>{row.categoryName}</StyledTableCell>
                    <StyledTableCell align="right">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={row.status == "on" ? true : false}
                            onChange={(e) => statusChange(row._id)}
                            name="gilad"
                          />
                        }
                      />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        aria-label="delete"
                        onClick={() => DeleteCategory(row._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton onClick={() => UpdateCategory(row._id)}>
                        <EditIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </DashTheme>
  );
};

export default Category;
