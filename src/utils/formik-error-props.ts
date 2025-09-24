/* eslint-disable @typescript-eslint/no-explicit-any */
import type { useFormik, useFormikContext } from "formik";

function findingName(name: string, values: Record<string, any>): boolean {
  if (!values) return false;
  if (name.includes(".")) {
    const [parent, child] = name.split(".");
    return findingName(child, values[parent]);
  }
  return name in values;
}

function getValue(name: string, values: Record<string, any>): any {
  if (!values) return undefined;
  if (name.includes(".")) {
    const [parent, child] = name.split(".");
    return getValue(child, values[parent]);
  }
  return values[name];
}

export default function getErrorProps(
  formik: ReturnType<typeof useFormik<any> | typeof useFormikContext<any>>,
  name: string
) {
  if (findingName(name, formik.values)) {
    const touched = getValue(name, formik.touched);
    const error = getValue(name, formik.errors);
    return {
      error: Boolean(touched && error),
      helperText: touched ? (error as unknown as string) || " " : " ",
    };
  }
  return { helperText: " " };
}
