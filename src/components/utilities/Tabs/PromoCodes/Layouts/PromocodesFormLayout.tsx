import { Box } from "@mui/system";
import {useState} from 'react'
import { Tab, Tabs } from "@mui/material";
import PromocodeFormElements from "./PromocodeFormElements";
import ViewPromoCode from "./ViewPromoCode";
import ModifyPromoCode from "./ModifyPromoCode";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const PromocodesFormLayout = () => {

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{
        style: {
          display: 'none'
        }
      }}>
          <Tab label="Add Promo Code" {...a11yProps(0)} />
          <Tab label="Modify Promo Code" {...a11yProps(1)} />
          <Tab label="View Promo Code" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
      <PromocodeFormElements/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ModifyPromoCode/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ViewPromoCode/>
      </CustomTabPanel>
    </Box>
    </Box>
  );
};

export default PromocodesFormLayout;

