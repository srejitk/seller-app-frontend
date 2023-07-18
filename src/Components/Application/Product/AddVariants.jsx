import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
import { allProperties } from "./categoryProperties";
import MyButton from "../../Shared/Button";
import VarinatForm from "./VariantForm";
import {v4 as uuidv4} from 'uuid';


import {
  allProductFieldDetails,
  variationCommonFields,
} from "./product-fields";
import useForm from "../../../hooks/useForm";
import { IntegrationInstructions } from "@mui/icons-material";

const AddVariants = ({
  category,
  subCategory,
  variants,
  selectedVariantNames,
  variantFields,
  variantInitialValues,
  variantForms,
  setVariantForms,
  shouldValidate,
  variantFormsErrors,
  setVariantFormsErrors,
  setTabErrors,
  setFormValidate
}) => {
  const getProductFieldDetails = (field_id) => {
    return allProductFieldDetails.find((field) => field.id === field_id);
  };


  useEffect(() => {
    let forms_errors = variantFormsErrors.map(form_errors => Object.values(form_errors).some((val) => val !== ""))
    let are_valid_forms = !forms_errors.some(val => val === true)
    setTabErrors((prevState) => {
      prevState[2] = !are_valid_forms
      return [...prevState];
    });
    setFormValidate(false);

}, [variantFormsErrors]);

useEffect(() => {
  if (variantForms.length === 0) {
    addNewVariationForm();
  }
}, [variantForms])

  const addNewVariationForm = () => {
    setVariantForms([...variantForms, {...variantInitialValues, formKey: uuidv4()}]);
  };

  const handleOnVariantFormUpdate = (index, formValues) => {
    variantForms[index] = formValues;
    setVariantForms([...variantForms]);
  };

  const handleRemoveForm = (i) => {
    variantForms.splice(i, 1);
    setVariantForms([...variantForms]);
    variantFormsErrors.splice(i, 1);
    setVariantFormsErrors([...variantFormsErrors])
  }

  const renderForms = () => {
    return variantForms.map((form, i) => {
      return (
        <VarinatForm
          key={form.formKey}
          index={i}
          formData={form}
          fields={variantFields}
          onFormUpdate={handleOnVariantFormUpdate}
          shouldValidate={shouldValidate}
          formsErrors={variantFormsErrors}
          setFormsErrors={setVariantFormsErrors}
          removeForm={handleRemoveForm}
        />
      );
    });
  };

  return (
    <>
      {renderForms()}
      <MyButton
        type="button"
        title="Add Variation"
        className="text-black"
        onClick={() => addNewVariationForm()}
      />
    </>
  );
};

export default AddVariants;
