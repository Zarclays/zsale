// import * as React from "react";
// import { TextField } from "@material-ui/core";
// import {
//   Controller,
//   useFormContext,
//   useController,
//   get
// } from "react-hook-form";
// export const TextFieldCustom = ({ ...props }) => {
//   const { meta } = useController(props);
//   const { control, formState } = useFormContext();
//   const error = get(formState.errors, props.name);
//   const errorText = meta.invalid ? error.message : "";

//   return (
//     <Controller
//       {...props}
//       as={TextField}
//       variant="outlined"
//       size="small"
//       control={control}
//       helperText={errorText ? errorText : props.helperText}
//       error={!!errorText}
//       defaultValue={props.defaultValue}
//     />
//   );
// };

export {}
