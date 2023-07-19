import { useEffect, useState } from "react";
import RenderInput from "../../../utils/RenderInput";
import useForm from "../../../hooks/useForm";
import VitalForm from "./VitalForm";

const AddVitalInfo = ({
  selectedVariantNames,
  vitalFields,
  vitalForm,
  setVitalForm,
  vitalFormErrors,
  setVitalFormErrors,
  tabErrors,
  setTabErrors,
  shouldValidate,
  setFormValidate,
}) => {
  const [fields, setFields] = useState([]);

  const getFields = () => {
    return vitalFields.map((variant) => {
      return {
        id: variant.name,
        title: variant.name,
        placeholder: "Example, " + variant.example,
        type: variant.type === "text" ? "input" : variant.type,
        required: true,
      };
    });
  };

  useEffect(() => {
    let vital_fields = getFields();
    setFields(vital_fields);

    if (Object.keys(vitalForm).length == 0) {
      let initial_values = vital_fields.reduce((acc, field) => {
        acc[field.id] = "";
        return acc;
      }, {});
      setVitalForm(initial_values);
    }
  }, [vitalFields]);

  const handleFormUpdate = (data) => {
    setVitalForm(data);
  };

  if (Object.keys(vitalForm).length > 0) {
    return (
      <VitalForm
        fields={getFields()}
        formData={vitalForm}
        onFormUpdate={handleFormUpdate}
        onFormErrorUpdate={setVitalFormErrors}
        vitalFormErrors={vitalFormErrors}
        setVitalFormErrors={setVitalFormErrors}
        tabErrors={tabErrors}
        setTabErrors={setTabErrors}
        shouldValidate={shouldValidate}
        setFormValidate={setFormValidate}
      />
    );
  }
};

export default AddVitalInfo;
