import { Button, CircularProgress, Divider, MenuItem, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import React from 'react';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  phone_number: Yup.string().matches(/^[0-9]+$/, 'Mobile No must be numeric').required('Mobile No is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  admin_type: Yup.string().required('Group is required'),
  aoc_scheme: Yup.string().required('AOC Scheme is required'),
  margin_amount: Yup.number().required('Margin Amount is required'),

  job_percent: Yup.number().required('Equity Job % is required'),
  job_min: Yup.number().required('Equity Job min is required'),
  del_percent: Yup.number().required('Equity Del % is required'),
  del_min: Yup.number().required('Equity Del min is required'),
  der_fut_percent: Yup.number().required('Derivative future % is required'),
  der_opt_percent: Yup.number().required('Derivative option % is required'),
  der_opt_min: Yup.number().required('Derivative option min is required'),
  der_opt_max: Yup.number().required('Derivative option max is required'),
  curr_fut_percent: Yup.number().required('Currency future % is required'),
  curr_opt_percent: Yup.number().required('Currency option % is required'),
  curr_opt_min: Yup.number().required('Currency option min is required'),
  curr_opt_max: Yup.number().required('Currency option max is required'),
  comm_fut_percent: Yup.number().required('Commodity future % is required'),
  comm_opt_percent: Yup.number().required('Commodity option % is required'),
});

const SendLink = () => {
  return (
    <Box
      sx={{
        bgcolor: "#FFFF",
        borderRadius: 2,
        p: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Send Link</Typography>
      </Box>
      <Formik
        initialValues={{
          name: '',
          phone_number: '',
          email: '',
          admin_type: '',
          aoc_scheme: '',
          margin_amount:'',
          job_percent:'',
          job_min:'',
          del_percent:'',
          del_min:'',
          der_fut_percent: '',
          der_opt_percent: '',
          der_opt_min: '',
          der_opt_max: '',
          curr_fut_percent: '',
          curr_opt_percent: '',
          curr_opt_min: '',
          curr_opt_max: '',
          comm_fut_percent: '',
          comm_opt_percent: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
          }, 500);
        }}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Name</Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    name="name"
                    type="text"
                    placeholder="Enter Your Name"
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Mobile No</Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    name="phone_number"
                    type="text"
                    placeholder="Enter Mobile No"
                    error={Boolean(touched.phone_number && errors.phone_number)}
                    helperText={touched.phone_number && errors.phone_number}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Email</Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    name="email"
                    type="email"
                    placeholder="Enter Email ID"
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle2">Group</Typography>
                <Field
                  as={TextField}
                  name="admin_type"
                  select
                  fullWidth
                  error={Boolean(touched.admin_type && errors.admin_type)}
                  helperText={touched.admin_type && errors.admin_type}
                >
                  <MenuItem value="kra">group1</MenuItem>
                  <MenuItem value="telecaller">group1</MenuItem>
                  <MenuItem value="backoffice">group1</MenuItem>
                  <MenuItem value="grootsupport">group1</MenuItem>
                </Field>
              </Box>
              <Box>
                <Typography variant="subtitle2">AOC Scheme</Typography>
                <Field
                  as={TextField}
                  name="aoc_scheme"
                  select
                  fullWidth
                  error={Boolean(touched.aoc_scheme && errors.aoc_scheme)}
                  helperText={touched.aoc_scheme && errors.aoc_scheme}
                >
                  <MenuItem value="scheme1">scheme 1</MenuItem>
                  <MenuItem value="scheme2">scheme 2</MenuItem>
                  <MenuItem value="scheme3">scheme 3</MenuItem>
                  <MenuItem value="scheme4">scheme 4</MenuItem>
                </Field>
              </Box>
              <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Margin Amount</Typography>
                  <Field
                    as={TextField}
                    name="margin_amount"
                    type="number"
                    inputProps={{
                      pattern: "[0-9]*",
                      inputMode: "numeric",
                    }}
                    placeholder="Enter Margin Amount"
                    error={Boolean(touched.margin_amount && errors.margin_amount)}
                    helperText={touched.margin_amount && errors.margin_amount}
                  />
                </Box>

                <Divider />

                <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography >Equity Slab</Typography>
      </Box>
      <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  flexDirection: { xs: "column", md: "row" },
                }}
              >

      <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Job %</Typography>
                  <Field
                    as={TextField}
                    name="job_percent"
                    type="text"
                    placeholder="Enter Job %"
                    error={Boolean(touched.job_percent && errors.job_percent)}
                    helperText={touched.job_percent && errors.job_percent}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Job Min</Typography>
                  <Field
                    as={TextField}
                    name="job_min"
                    type="text"
                    placeholder="Enter Job Min"
                    error={Boolean(touched.job_min && errors.job_min)}
                    helperText={touched.job_min && errors.job_min}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Del %</Typography>
                  <Field
                    as={TextField}
                    name="del_percent"
                    type="text"
                    placeholder="Enter Del %"
                    error={Boolean(touched.del_percent && errors.del_percent)}
                    helperText={touched.del_percent && errors.del_percent}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">Del Min</Typography>
                  <Field
                    as={TextField}
                    name="del_min"
                    type="text"
                    placeholder="Enter Del Min"
                    error={Boolean(touched.del_min && errors.del_min)}
                    helperText={touched.del_min && errors.del_min}
                  />
                </Box> 
                </Box>

                <Divider />

<Box
sx={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
mb: 2,
}}
>
<Typography >Derivative Slab</Typography>
</Box>
<Box
sx={{
  display: "flex",
  gap: 2,
  flexWrap: "wrap",
  flexDirection: { xs: "column", md: "row" },
}}
>

<Box sx={{ flex: 1 }}>
  <Typography variant="subtitle2">Future %</Typography>
  <Field
    as={TextField}
    name="der_fut_percent"
    type="text"
    placeholder="Enter Job %"
    error={Boolean(touched.der_fut_percent && errors.der_fut_percent)}
    helperText={touched.der_fut_percent && errors.der_fut_percent}
  />
</Box>

<Box sx={{ flex: 1 }}>
  <Typography variant="subtitle2">Option %</Typography>
  <Field
    as={TextField}
    name="der_opt_percent"
    type="text"
    placeholder="Enter Job Min"
    error={Boolean(touched.der_opt_percent && errors.der_opt_percent)}
    helperText={touched.der_opt_percent && errors.der_opt_percent}
  />
</Box>

<Box sx={{ flex: 1 }}>
  <Typography variant="subtitle2">Option min</Typography>
  <Field
    as={TextField}
    name="der_opt_min"
    type="text"
    placeholder="Enter Del %"
    error={Boolean(touched.der_opt_min && errors.der_opt_min)}
    helperText={touched.der_opt_min && errors.der_opt_min}
  />
</Box>

<Box sx={{ flex: 1 }}>
  <Typography variant="subtitle2">Option Max</Typography>
  <Field
    as={TextField}
    name="der_opt_max"
    type="text"
    placeholder="Enter Del Min"
    error={Boolean(touched.der_opt_max && errors.der_opt_max)}
    helperText={touched.der_opt_max && errors.der_opt_max}
  />
</Box> 
</Box>

<Divider />

<Box
sx={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
mb: 2,
}}
>
<Typography >Currency Slab</Typography>
</Box>
<Box
sx={{
  display: "flex",
  gap: 2,
  flexWrap: "wrap",
  flexDirection: { xs: "column", md: "row" },
}}
>

<Box sx={{ flex: 1 }}>
  <Typography variant="subtitle2">Future %</Typography>
  <Field
    as={TextField}
    name="curr_fut_percent"
    type="text"
    placeholder="Enter Job %"
    error={Boolean(touched.curr_fut_percent && errors.curr_fut_percent)}
    helperText={touched.curr_fut_percent && errors.curr_fut_percent}
  />
</Box>

<Box sx={{ flex: 1 }}>
  <Typography variant="subtitle2">Option %</Typography>
  <Field
    as={TextField}
    name="curr_opt_percent"
    type="text"
    placeholder="Enter Job Min"
    error={Boolean(touched.curr_opt_percent && errors.curr_opt_percent)}
    helperText={touched.curr_opt_percent && errors.curr_opt_percent}
  />
</Box>

<Box sx={{ flex: 1 }}>
  <Typography variant="subtitle2">Option Min</Typography>
  <Field
    as={TextField}
    name="curr_opt_min"
    type="text"
    placeholder="Enter Del %"
    error={Boolean(touched.curr_opt_min && errors.curr_opt_min)}
    helperText={touched.curr_opt_min && errors.curr_opt_min}
  />
</Box>

<Box sx={{ flex: 1 }}>
  <Typography variant="subtitle2">Option Max</Typography>
  <Field
    as={TextField}
    name="curr_opt_max"
    type="text"
    placeholder="Enter Del Min"
    error={Boolean(touched.curr_opt_max && errors.curr_opt_max)}
    helperText={touched.curr_opt_max && errors.curr_opt_max}
  />
</Box> 
</Box>

<Divider />

<Box
sx={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
mb: 2,
}}
>
<Typography >Commodity Slab</Typography>
</Box>
<Box
sx={{
  display: "flex",
  gap: 2,
  flexWrap: "wrap",
  flexDirection: { xs: "column", md: "row" },
}}
>

<Box sx={{ flex: 1 }}>
  <Typography variant="subtitle2">Future %</Typography>
  <Field
    as={TextField}
    name="comm_fut_percent"
    type="text"
    placeholder="Enter Job %"
    error={Boolean(touched.comm_fut_percent && errors.comm_fut_percent)}
    helperText={touched.comm_fut_percent && errors.comm_fut_percent}
  />
</Box>

<Box sx={{ flex: 1 }}>
  <Typography variant="subtitle2">Option %</Typography>
  <Field
    as={TextField}
    name="comm_opt_percent"
    type="text"
    placeholder="Enter Job Min"
    error={Boolean(touched.comm_opt_percent && errors.comm_opt_percent)}
    helperText={touched.comm_opt_percent && errors.comm_opt_percent}
  />
</Box>
</Box>

                
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  sx={{
                    height: "52px",
                    width: { xs: 'auto', md: 'fit-content' },
                    "&:hover": {
                      bgcolor: "primary.main",
                    },
                  }}
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress /> : "Send Link"}
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SendLink;
