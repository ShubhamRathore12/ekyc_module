import { Box } from "@mui/system";
import {useState} from 'react'
import { Tab, Tabs } from "@mui/material";
import AocShemeFormElements from "./AocShemeFormElements";
import ModifyAocScheme from "./ModifyAocScheme";

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

const AocShemeFormLayout = () => {

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
          <Tab label="Add Scheme" {...a11yProps(0)} />
          <Tab label="Modify Scheme" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <AocShemeFormElements/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ModifyAocScheme/>
      </CustomTabPanel>
    </Box>
    </Box>
  );
};

export default AocShemeFormLayout;