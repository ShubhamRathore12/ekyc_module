import useWindowDimensions from "@hooks/useWindowDimensions";
import { Add } from "@mui/icons-material";
import {
    Button,
    Chip,
    CircularProgress,
    FormControl,
    FormHelperText,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { Typography } from "@mui/material/";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import handleError from "@utils/handleError";
import { FieldArray, FormikProvider, useFormik } from "formik";
import React from "react";
import { toast } from "react-hot-toast";
import {
    useBrokerageSchemeListQuery,
    useGeneratePromoCodeMutation,
    useProductCodeListQuery,
    usePromoCodeCreatedQuery,
    usePromoCodeDetailQuery,
    useSchemeListQuery,
    useUpdatePromoCodeMutation,
} from "services/accountopen.service";
import { GeneratePromoCodeRequest, PromoCode, Scheme } from "types/account";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

interface FormValues {
    promoCode_list: string;
    promo_code: string;
    desc: string;
    from_date: Date | null;
    to_date: Date | null;
    active: boolean;
    group3_mapping: string;
    promo_code_limit: number;
    promo_code_remaining: number;
    remarks: string;
    scheme_mapping: {
        id: string;
        account_opening_scheme_code: string;
        brokerage_scheme_codes: string[];
    }[];
    type_mapping: string[];
    product_code: string
}

const ModifyPromoCode = () => {
    const { data: productData, error: productError, isLoading: productLoading } = useProductCodeListQuery();
    const { height, width } = useWindowDimensions();
    const [windowWidth, setWindowWidth] = React.useState(0);
    const [updatePromoCode] = useUpdatePromoCodeMutation();
    const { data, error, isLoading } = useSchemeListQuery();
    const [selectedPromoCode, setSelectedPromoCode] = React.useState<string>("");
    const {
        data: brokSchemeListData,
        error: brokSchemeListError,
        isLoading: brokSchemeListLoading,
    } = useBrokerageSchemeListQuery({});

    const { data: promoCodeList, error: promoCodeListError, isLoading: promoCodeListLoading } = usePromoCodeCreatedQuery({ active: false })

    const promoCodes = promoCodeList?.data?.promo_codes;

    const schemeList: Scheme[] = data?.data?.schemes || [];

    document.addEventListener(
        "wheel",
        (event: WheelEvent) => {
            const activeElement = document.activeElement as HTMLInputElement;
            if (activeElement?.type === "number" && activeElement === event.target) {
                event.preventDefault();
            }
        },
        { passive: false }
    );

    React.useEffect(() => {
        return setWindowWidth(width);
    }, [width]);

    const typeOptions = [
        { label: "BRANCH", value: "B" },
        { label: "FRANCHISE", value: "F" },
        { label: "OTHER", value: "O" },
        { label: "BRANCH FRANCHISE", value: "G" },
        { label: "BDR", value: "D" },
    ];

    const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        const value = e.target.value;
        formik.setFieldValue(e.target.name, value);
        if (e.target.name === "promoCode_list") {
            setSelectedPromoCode(value);
        }
    };

    const {
        data: promoCodeDetails,
        error: promoCodeDetailsError,
        isLoading: promoCodeDetailsLoading,
    } = usePromoCodeDetailQuery((selectedPromoCode), {
        skip: !selectedPromoCode,
    });

    function convertStringToDate(dateString: string): Date | null {
        if (!dateString) return null; // Handle null or undefined strings

        const [day, month, year] = dateString.split('-').map(Number);

        // Check if the date parts are valid numbers
        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return null; // Return null for invalid dates
        }

        // Create and return the Date object
        return new Date(year, month - 1, day);
    }


    React.useEffect(() => {
        if (promoCodeDetails?.data?.promo_codes?.[0]) {
            const promoCode = promoCodeDetails.data.promo_codes[0];
            const fromDate = convertStringToDate(promoCode.from_date)
            const toDate = convertStringToDate(promoCode.to_date)

            formik.setValues({
                promoCode_list: promoCode.promo_code,
                promo_code: promoCode.promo_code,
                desc: promoCode.desc,
                from_date: fromDate,
                to_date: toDate,
                active: promoCode.active,
                group3_mapping: Array.isArray(promoCode.group3_mapping)
                    ? promoCode.group3_mapping.join(',')
                    : '',
                promo_code_limit: promoCode.promo_code_limit,
                promo_code_remaining: promoCode.promo_code_remaining,
                remarks: promoCode.remarks,
                scheme_mapping: promoCode.scheme_mapping.map(scheme => ({
                    id: uuidv4(),
                    account_opening_scheme_code: scheme.account_opening_scheme_code,
                    brokerage_scheme_codes: scheme.brokerage_scheme_codes.map(code => code.scheme_code),
                })),
                type_mapping: promoCode.type_mapping,
                product_code: promoCode.product_code
            });
        }
    }, [promoCodeDetails]);


    const formik = useFormik<FormValues>({
        initialValues: {
            promoCode_list: "",
            promo_code: "",
            desc: "",
            from_date: null,
            to_date: null,
            active: true,
            group3_mapping: "",
            promo_code_limit: 0,
            promo_code_remaining: 0,
            remarks: "",
            scheme_mapping: [
                {
                    id: uuidv4(),
                    account_opening_scheme_code: "",
                    brokerage_scheme_codes: [],
                },
            ],
            type_mapping: [],
            product_code: ""
        },

        validationSchema: Yup.object().shape({
            promoCode_list: Yup.string().required("Please select Promo Code"),
            promo_code: Yup.string()
                .required("Promo Code is required")
                .matches(/^[A-Za-z0-9]+$/, "Special characters are not allowed"),
            desc: Yup.string().required("Description is required"),
            from_date: Yup.string().required("From Date is required"),
            to_date: Yup.string().required("To Date is required"),
            active: Yup.string().required("Is Active required"),
            group3_mapping: Yup.string().test(
                "valid-format",
                "Only alphanumerics, hyphens (between characters), and single commas are allowed. Consecutive commas or invalid hyphen placements are not allowed.",
                (value) =>
                    /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*(?:,[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)*$/.test(String(value))
            ),
            promo_code_limit: Yup.number().test(
                "is-positive-integer",
                "Promo Code Limit must be a positive integer without special characters",
                (value) => {
                    return /^\d+$/.test(String(value));
                }
            ),
            promo_code_remaining: Yup.number().test(
                "is-positive-integer",
                "Promo Code Remaining must be a positive integer without special characters",
                (value) => {
                    return /^\d+$/.test(String(value));
                }
            ),
            // remarks: Yup.string().required("Remarks is required"),

            scheme_mapping: Yup.array().of(
                Yup.object().shape({
                    account_opening_scheme_code: Yup.string().required("Account Scheme is required"),
                    brokerage_scheme_codes: Yup.array()
                        .min(1, "At least one Brokerage Scheme Code is required")
                        .required("Brokerage Scheme Codes are required"),
                })
            ),
            product_code: Yup.string().required("Product Code is required"),
            // type_mapping : Yup.array()
            // .min(1, "At least one Type must be selected")
            // .required("Type is required"),
        }),

        onSubmit: async (values, helpers) => {
            helpers.setSubmitting(true);

            const formattedValues = {
                ...values,
                from_date: values.from_date && dayjs(values.from_date).format("DD-MM-YYYY"),
                to_date: values.to_date && dayjs(values.to_date).format("DD-MM-YYYY"),
            };

            if (
                values.from_date &&
                values.to_date &&
                dayjs(values.to_date).isBefore(dayjs(values.from_date))
            ) {
                toast.error("The 'To Date' cannot be earlier than the 'From Date'.");
                helpers.setSubmitting(false);
                return;
            }

            if (values.group3_mapping.length == 0 && values.type_mapping.length == 0) {
                toast.error("Group 3 or Type Mapping - One of the field is required");
                helpers.setSubmitting(false);
                return;
            }

            const transformedSchemeMapping = values.scheme_mapping.map((scheme) => {
                const accountOpeningScheme = schemeList.find(
                    (option) => option.scheme_code === scheme.account_opening_scheme_code
                );

                const brokerageSchemes = scheme.brokerage_scheme_codes.map((code) => {
                    const brokerageScheme = brokSchemeListData?.data?.schemes.find(
                        (option) => option.scheme_code === code
                    );
                    return {
                        scheme_code: code,
                        scheme_name: brokerageScheme?.scheme_name || "",
                    };
                });

                return {
                    account_opening_scheme_code: scheme.account_opening_scheme_code,
                    account_opening_scheme_name: accountOpeningScheme?.scheme_name || "",
                    brokerage_scheme_codes: brokerageSchemes,
                };
            });

            formattedValues.scheme_mapping = transformedSchemeMapping as any;

            // const valuesArray = values.group3_mapping.split(",").map((item) => item.trim());
            // formattedValues.group3_mapping = valuesArray as any;
            const valuesArray = values.group3_mapping.split(",").map((item) => item.trim()).filter((item) => item.length > 0);
            formattedValues.group3_mapping = valuesArray.length > 0 ? valuesArray as any : [];

            try {
                const response = await updatePromoCode(formattedValues as unknown as GeneratePromoCodeRequest).unwrap();
                toast.success(response?.message);
            } catch (error) {
                handleError(error);
            } finally {
                helpers.setSubmitting(false);
            }
        },
    });
    return (
        <FormikProvider value={formik}>
            <Box
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit(e);
                }}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    m: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        mb: 2,
                        gap: 1,
                        flexWrap: "wrap",
                        flexDirection: { xs: "column", md: "row" },
                    }}
                >
                    <Box sx={{ width: { xs: "100%", sm: "100px" }, display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle2">Promo Code List</Typography>
                    </Box>
                    <Box sx={{ width: { lg: "40%", xs: "100%" }, }}>
                        <TextField
                            name="promoCode_list"
                            fullWidth
                            select
                            error={Boolean(formik.touched.promoCode_list && formik.errors.promoCode_list)}
                            onChange={handleChange}
                            value={formik.values.promoCode_list}
                        >
                            <MenuItem value="" disabled>
                                Select a promo code
                            </MenuItem>
                            {promoCodeListLoading && <MenuItem disabled>Loading...</MenuItem>}
                            {promoCodeListError && <MenuItem disabled>Error loading schemes</MenuItem>}
                            {!isLoading && !error && schemeList.length > 0
                                ? promoCodes?.map((promoCodes) => (
                                    <MenuItem key={promoCodes?.promo_code} value={promoCodes?.promo_code}>
                                        {promoCodes?.promo_code}
                                    </MenuItem>
                                ))
                                : !isLoading && !error && <MenuItem disabled>No schemes available</MenuItem>}
                        </TextField>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        mb: 2,
                        gap: 1,
                        flexWrap: "wrap",
                        flexDirection: { xs: "column", md: "row" },
                    }}
                >
                    <Box sx={{ width: { xs: "100%", sm: "100px" }, display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle2">Promo Code</Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            width: "100%",
                        }}
                    >
                        <TextField
                            disabled
                            inputProps={{ maxLength: 200 }}
                            name="promo_code"
                            fullWidth
                            type="text"
                            error={Boolean(formik.touched.promo_code && formik.errors.promo_code)}
                            helperText={(formik.touched.promo_code && formik.errors.promo_code) || " "}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.promo_code}
                        ></TextField>
                    </Box>
                    <Box
                        sx={{
                            width: { xs: "100%", sm: "100px" },
                            display: "flex",
                            alignItems: "center",
                            ml: { lg: 2 },
                        }}
                    >
                        <Typography variant="subtitle2">Description</Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            width: "100%",
                        }}
                    >
                        <TextField
                            inputProps={{ maxLength: 200 }}
                            name="desc"
                            fullWidth
                            type="text"
                            error={Boolean(formik.touched.desc && formik.errors.desc)}
                            helperText={(formik.touched.desc && formik.errors.desc) || " "}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.desc}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        flexDirection: { xs: "column", md: "row" },
                        width: "100%",
                        mb: { lg: 3 },
                    }}
                >
                    <Box sx={{ width: { xs: "100%", sm: "100px" }, display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle2">From Date</Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            width: "100%",
                        }}
                    >
                        <DatePicker
                            value={formik.values.from_date}
                            onChange={(newValue) => {
                                formik.setFieldValue("from_date", newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    fullWidth
                                    {...params}
                                    error={Boolean(formik.touched.from_date && formik.errors.from_date)}
                                    helperText={formik.touched.from_date && formik.errors.from_date}
                                />
                            )}
                            inputFormat="dd-MM-yyyy"
                        />
                    </Box>

                    <Box
                        sx={{
                            width: { xs: "100%", sm: "100px" },
                            display: "flex",
                            alignItems: "center",
                            ml: { lg: 2 },
                        }}
                    >
                        <Typography variant="subtitle2">To Date</Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            width: "100%",
                        }}
                    >
                        <DatePicker
                            minDate={formik.values.from_date}
                            value={formik.values.to_date}
                            onChange={(newValue) => {
                                formik.setFieldValue("to_date", newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    fullWidth
                                    {...params}
                                    error={Boolean(formik.touched.to_date && formik.errors.to_date)}
                                    helperText={formik.touched.to_date && formik.errors.to_date}
                                />
                            )}
                            inputFormat="dd-MM-yyyy"
                        />
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        mb: 2,
                        gap: 1,
                        flexWrap: "wrap",
                        flexDirection: { xs: "column", md: "row" },
                    }}
                >
                    <Box sx={{ width: { xs: "100%", sm: "100px" }, display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle2">Active</Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            width: "100%",
                        }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <TextField
                                name="active"
                                fullWidth
                                select
                                error={Boolean(formik.touched.active && formik.errors.active)}
                                helperText={(formik.touched.active && formik.errors.active) || " "}
                                onBlur={formik.handleBlur}
                                onChange={(e) => {
                                    const value = e.target.value === "true" ? true : false;
                                    formik.setFieldValue("active", value);
                                }}
                                value={formik.values.active}
                            >
                                <MenuItem value="true"> Yes</MenuItem>
                                <MenuItem value="false"> No</MenuItem>
                            </TextField>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            width: { xs: "100%", sm: "100px" },
                            display: "flex",
                            alignItems: "center",
                            ml: { lg: 2 },
                        }}
                    >
                        <Typography variant="subtitle2">Group 3</Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            width: "100%",
                        }}
                    >
                        <TextField
                            name="group3_mapping"
                            placeholder="Example - abc,def,xyz"
                            fullWidth
                            type="text"
                            error={Boolean(formik.touched.group3_mapping && formik.errors.group3_mapping)}
                            helperText={(formik.touched.group3_mapping && formik.errors.group3_mapping) || ""}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.group3_mapping || ""}
                        ></TextField>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        mb: 2,
                        gap: 1,
                        flexWrap: "wrap",
                        flexDirection: { xs: "column", md: "row" },
                    }}
                >
                    <Box sx={{ width: { xs: "100%", sm: "100px" }, display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle2">Promo Code Limit</Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            width: "100%",
                        }}
                    >
                        <TextField
                            name="promo_code_limit"
                            fullWidth
                            error={Boolean(formik.touched.promo_code_limit && formik.errors.promo_code_limit)}
                            value={formik.values.promo_code_limit}
                            helperText={
                                (formik.touched.promo_code_limit && formik.errors.promo_code_limit) || " "
                            }
                            onBlur={formik.handleBlur}
                            type="number"
                            onChange={(e) => {
                                const value = e.target.value;
                                const integerValue = value.replace(/[^0-9]/g, "");
                                formik.setFieldValue(
                                    "promo_code_limit",
                                    integerValue ? parseInt(integerValue, 10) : ""
                                );
                            }}
                        ></TextField>
                    </Box>
                    <Box
                        sx={{
                            width: { xs: "100%", sm: "100px" },
                            display: "flex",
                            alignItems: "center",
                            ml: { lg: 2 },
                        }}
                    >
                        <Typography variant="subtitle2">Promo Code Remaining</Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            width: "100%",
                        }}
                    >
                        <TextField
                            name="promo_code_remaining"
                            fullWidth
                            error={Boolean(
                                formik.touched.promo_code_remaining && formik.errors.promo_code_remaining
                            )}
                            value={formik.values.promo_code_remaining}
                            helperText={
                                (formik.touched.promo_code_remaining && formik.errors.promo_code_remaining) || " "
                            }
                            onBlur={formik.handleBlur}
                            type="number"
                            onChange={(e) => {
                                const value = e.target.value;
                                const integerValue = value.replace(/[^0-9]/g, "");
                                formik.setFieldValue(
                                    "promo_code_remaining",
                                    integerValue ? parseInt(integerValue, 10) : ""
                                );
                            }}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        mb: 2,
                        gap: 1,
                        flexWrap: "wrap",
                        flexDirection: { xs: "column", md: "row" },
                    }}
                >
                    <Box sx={{ width: { xs: "100%", sm: "100px" }, display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle2">Remarks</Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            width: "100%",
                        }}
                    >
                        <TextField
                            inputProps={{ maxLength: 200 }}
                            name="remarks"
                            fullWidth
                            type="text"
                            error={Boolean(formik.touched.remarks && formik.errors.remarks)}
                            helperText={(formik.touched.remarks && formik.errors.remarks) || " "}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.remarks}
                        ></TextField>
                    </Box>
                    <Box
                        sx={{
                            width: { xs: "100%", sm: "100px" },
                            display: "flex",
                            alignItems: "center",
                            ml: { lg: 2 },
                        }}
                    >
                        <Typography variant="subtitle2">Type Mapping</Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            width: "100%",
                        }}
                    >
                        <FormControl fullWidth>
                            <Select
                                labelId="type-multi-select-label"
                                id="type-multi-select"
                                multiple
                                name="type_mapping"
                                value={formik.values.type_mapping}
                                error={formik.touched.type_mapping && Boolean(formik.errors.type_mapping)}
                                onChange={(event) => {
                                    formik.setFieldValue("type_mapping", event.target.value);
                                }}
                                onBlur={formik.handleBlur}
                                renderValue={(selected) => (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={typeOptions.find((option) => option.value === value)?.label}
                                            />
                                        ))}
                                    </Box>
                                )}
                            >
                                {typeOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched.type_mapping && formik.errors.type_mapping ? (
                                <FormHelperText>{formik.errors.type_mapping}</FormHelperText>
                            ) : null}
                        </FormControl>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        mb: 2,
                        gap: 1,
                        flexWrap: "wrap",
                        flexDirection: { xs: "column", md: "row" },
                    }}
                >
                    <Box sx={{ width: { xs: "100%", sm: "100px" }, display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle2">Product Code</Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            width: "100%",
                        }}
                    >
                        <TextField
                            select
                            fullWidth
                            error={
                                formik.touched.product_code &&
                                !!formik.errors.product_code
                            }
                            helperText={
                                formik.touched.scheme_mapping &&
                                formik.errors.product_code
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            name="product_code"
                            value={formik.values.product_code}
                        >
                            <MenuItem value="" disabled>
                                Select a Product Code
                            </MenuItem>
                            {productData?.data?.map((option: any) => (
                                <MenuItem key={option.product_code} value={option.product_code}>
                                    {option.product_code}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                </Box>



                {/* ----------------select----------------- */}
                <FieldArray name="scheme_mapping">
                    {({ push, remove }) => (
                        <>
                            {formik.values.scheme_mapping.map((scheme, index) => (
                                <Box
                                    key={scheme.id}
                                    sx={{
                                        display: "flex",
                                        mb: 2,
                                        gap: 1,
                                        flexWrap: "wrap",
                                        flexDirection: { xs: "column", md: "row" },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: { xs: "100%", sm: "100px" },
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography>Account Opening Scheme</Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            flex: 1,
                                            width: "100%",
                                        }}
                                    >
                                        <Box sx={{ flex: 1 }}>
                                            <TextField
                                                select
                                                fullWidth
                                                error={
                                                    formik.touched.scheme_mapping &&
                                                    Boolean(
                                                        formik.getFieldMeta(
                                                            `scheme_mapping.${index}.account_opening_scheme_code`
                                                        ).error
                                                    )
                                                }
                                                helperText={
                                                    formik.touched.scheme_mapping &&
                                                    formik.getFieldMeta(`scheme_mapping.${index}.account_opening_scheme_code`)
                                                        .error
                                                }
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                name={`scheme_mapping.${index}.account_opening_scheme_code`}
                                                value={scheme.account_opening_scheme_code}
                                            >
                                                <MenuItem value="" disabled>
                                                    Select a scheme
                                                </MenuItem>
                                                {schemeList.map((option) => (
                                                    <MenuItem key={option.scheme_code} value={option.scheme_code}>
                                                        {option.scheme_name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            width: { xs: "100%", sm: "100px" },
                                            display: "flex",
                                            alignItems: "center",
                                            ml: { lg: 2 },
                                        }}
                                    >
                                        <Typography>Brokerage Scheme</Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            flex: 1,
                                            width: "100%",
                                        }}
                                    >
                                        <Box sx={{ flex: 1 }}>
                                            <FormControl
                                                fullWidth
                                                error={
                                                    formik.touched.scheme_mapping &&
                                                    Boolean(
                                                        formik.getFieldMeta(`scheme_mapping.${index}.brokerage_scheme_codes`)
                                                            .error
                                                    )
                                                }
                                            >
                                                <Select
                                                    labelId={`brokerage-scheme-label-${index}`}
                                                    multiple
                                                    name={`scheme_mapping.${index}.brokerage_scheme_codes`}
                                                    value={scheme.brokerage_scheme_codes || []}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.scheme_mapping &&
                                                        Boolean(
                                                            formik.getFieldMeta(`scheme_mapping.${index}.brokerage_scheme_codes`)
                                                                .error
                                                        )
                                                    }
                                                    onChange={(event) => {
                                                        formik.setFieldValue(
                                                            `scheme_mapping.${index}.brokerage_scheme_codes`,
                                                            event.target.value
                                                        );
                                                    }}
                                                    renderValue={(selected) => (
                                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                            {selected.map((value) => (
                                                                <Chip key={value} label={value} />
                                                            ))}
                                                        </Box>
                                                    )}
                                                >
                                                    {brokSchemeListData?.data?.schemes?.map((option) => (
                                                        <MenuItem key={option.scheme_code} value={option.scheme_code}>
                                                            {option.scheme_name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {formik.getFieldMeta(`scheme_mapping.${index}.brokerage_scheme_codes`)
                                                    .touched &&
                                                    formik.getFieldMeta(`scheme_mapping.${index}.brokerage_scheme_codes`)
                                                        .error && (
                                                        <FormHelperText>
                                                            {
                                                                formik.getFieldMeta(
                                                                    `scheme_mapping.${index}.brokerage_scheme_codes`
                                                                ).error
                                                            }
                                                        </FormHelperText>
                                                    )}
                                            </FormControl>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
                                        <Button
                                            variant="contained"
                                            type="button"
                                            onClick={() => remove(index)}
                                            disabled={formik.values.scheme_mapping.length === 1}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: "red",
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </Box>
                            ))}

                            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Add />}
                                    type="button"
                                    onClick={() =>
                                        push({
                                            id: uuidv4(),
                                            account_opening_scheme_code: "",
                                            brokerage_scheme_codes: [],
                                        })
                                    }
                                >
                                    Add
                                </Button>
                            </Box>
                        </>
                    )}
                </FieldArray>
                <Box>
                    <Button type="submit" variant="contained" sx={{ my: 2 }} disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? <CircularProgress /> : "Submit"}
                    </Button>
                </Box>
            </Box>
        </FormikProvider>
    );
};

export default ModifyPromoCode;
