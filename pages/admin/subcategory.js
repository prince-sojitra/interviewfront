import React, { useEffect, useState } from "react";
import DashTheme from "./Component/DashTheme";
import {
  Box,
  FormControl,
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
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

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

import { useFormik } from "formik";
import { useRouter } from "next/router";
import axios from "axios";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Subcategory = () => {
  let router = useRouter();

  const [allCategoryData, setAllCategoryData] = useState([]);
  const [allSubCategoryData, setAllSubCategoryData] = useState([]);
  const [opencategory, setOpencategory] = useState(false);
  const [selectcategories, setselectcategories] = useState("");
  const [uid, setUid] = useState(null);
  const filterCategories = allSubCategoryData
    ? allSubCategoryData.filter((el) =>
        selectcategories ? el.subCategoryname === selectcategories : true
      )
    : [];

  const statusChange = async (id, newData) => {
    try {
      let findData = allSubCategoryData.find((el) => el._id === id);
      console.log();
      if (findData?.categoryID?.status === "on") {
        let res = await axios.patch(
          `${process.env.BASE_URL}subcategory/${id}`,
          { status: newData },
          {
            headers: {
              Authorization: localStorage.getItem("Admin_Token"),
            },
          }
        );
      }
      allSubCategoryDataCallApi();
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
      subCategoryname: "",
      categoryID: "",
    },
    onSubmit: async (values) => {
      try {
        if (uid && uid.length) {
          let res = await axios.patch(
            `${process.env.BASE_URL}subcategory/${uid}`,
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
            `${process.env.BASE_URL}subcategory/create`,
            values,
            {
              headers: {
                Authorization: localStorage.getItem("Admin_Token"),
              },
            }
          );
        }
        handleClose();
        allSubCategoryDataCallApi();
        formik.resetForm();
      } catch (error) {
        console.log(error.message);
      }
    },
  });

  let allCategoryDataCallApi = async () => {
    try {
      let res = await axios.get(`${process.env.BASE_URL}category`, {
        headers: {
          Authorization: localStorage.getItem("Admin_Token"),
        },
      });

      setAllCategoryData(res.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

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

  let DeleteSubCategory = async (id) => {
    try {
      let res = await axios.delete(`${process.env.BASE_URL}subcategory/${id}`, {
        headers: {
          Authorization: localStorage.getItem("Admin_Token"),
        },
      });
      allSubCategoryDataCallApi();
    } catch (error) {
      console.log(error.message);
    }
  };

  let UpdateSubCategory = (id) => {
    handleClickOpencategory();
    let findData = allSubCategoryData.find((el) => el._id === id);
    formik.setFieldValue("subCategoryname", findData?.subCategoryname);
    formik.setFieldValue("categoryID", findData?.categoryID?._id);
    setUid(id);
  };
  useEffect(() => {
    let Admin_Token = localStorage.getItem("Admin_Token");
    if (!Admin_Token) {
      router.push("/admin/login");
    }
    allCategoryDataCallApi();
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
                  options={
                    allSubCategoryData
                      ? allSubCategoryData.map((el) => el.subCategoryname)
                      : []
                  }
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
                  Add Sub Catagory
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
                      Add Sub Catagory
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
                      <TextField
                        id="subCatagoryName"
                        name="subCategoryname"
                        type="text"
                        label="Sub Category"
                        variant="outlined"
                        onChange={formik.handleChange}
                        value={formik.values.subCategoryname}
                        sx={{ width: "100%", marginBottom: "15px" }}
                      />
                      <FormControl fullWidth>
                        <InputLabel id="CategoryList">Category Name</InputLabel>
                        <Select
                          labelId="CategoryList"
                          id="CategoryList"
                          name="categoryID"
                          value={formik.values.categoryID}
                          label="Category Name"
                          onChange={formik.handleChange}
                          sx={{ width: "100%" }}
                        >
                          {allCategoryData.map((el) => {
                            if (el.status === "on") {
                              return (
                                <MenuItem key={el?._id} value={el?._id}>
                                  {el?.categoryName}
                                </MenuItem>
                              );
                            }
                          })}
                        </Select>
                      </FormControl>
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
                  <StyledTableCell>Sub-Catagory Name</StyledTableCell>
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
                    <StyledTableCell>{row?.subCategoryname}</StyledTableCell>
                    <StyledTableCell>
                      {row?.categoryID?.categoryName}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={row?.status == "on" ? true : false}
                            onChange={(e) =>
                              statusChange(
                                row?._id,
                                e.target.checked ? "on" : "off"
                              )
                            }
                          />
                        }
                      />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        aria-label="delete"
                        onClick={() => DeleteSubCategory(row._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton onClick={() => UpdateSubCategory(row._id)}>
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

export default Subcategory;
