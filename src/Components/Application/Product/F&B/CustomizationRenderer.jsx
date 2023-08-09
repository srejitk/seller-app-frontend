import React, { useState } from "react";
import CustomizationGroup from "./CustomizationGroup";
import Customization from "./Customization";
import { Button } from "@mui/material";
import AddCustomizationGroup from "./AddCustomizationGroup";
import AddCustomization from "./AddCustomization";

const CustomizationRenderer = (props) => {
  const { category, customizationGroups, setCustomizationGroups, customizations, setCustomizations } = props;

  // states for holding info regarding addition of customization-group
  const [showCustomizationGroupModal, setShowCustomizationGroupModal] = useState(false);
  const [newCustomizationGroupData, setNewCustomizationGroupData] = useState({
    name: "",
    minQuantity: "",
    maxQuantity: "",
    seq: "",
    inputType: null,
  });
  const [selectedCustomization, setSelectedCustomization] = useState(null);

  // states for holding info regarding addition of customization
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [newCustomizationData, setNewCustomizationData] = useState({
    name: "",
    price: 0,
    inStock: true,
    parent: "",
    UOM: "",
    UOMValue: "",
    available: "",
    maximum: "",
    vegNonVeg: "",
  });

  // handles change in customizations group data
  const handleGroupChange = (updatedGroups) => {
    setCustomizationGroups(updatedGroups);
  };

  // handles change in customizations data
  const handleCustomizationChange = (updatedCustomizations) => {
    setCustomizations(updatedCustomizations);
  };

  // adds new customization group
  const handleAddCustomizationGroup = (data, inputType) => {
    const parentGroupIndex = customizationGroups.findIndex((c) => c.id === selectedCustomization.parent);
    let newCustomizationGroup = {
      ...data,
      id: `CG${customizationGroups.length + 1}`,
      seq: customizationGroups.length === 0 ? 1 : customizationGroups[parentGroupIndex].seq + 1,
      inputType: inputType.toLowerCase(),
    };

    if (customizationGroups.length > 0) {
      const selectedCustomizationIndex = customizations.findIndex((c) => c.id === selectedCustomization.id);
      const updatedCustomizations = [...customizations];
      updatedCustomizations[selectedCustomizationIndex] = {
        ...updatedCustomizations[selectedCustomizationIndex],
        child: newCustomizationGroup.id,
      };

      setCustomizations(updatedCustomizations);
    }
    setCustomizationGroups([...customizationGroups, newCustomizationGroup]);
    setShowCustomizationGroupModal(false);
    setNewCustomizationGroupData({});
  };

  const openCustomizationModal = () => {
    setShowCustomizationModal(true);
  };

  // adds new customization
  const handleAddCustomization = () => {
    let newCustomization = { ...newCustomizationData, id: `C${customizations.length + 1}`, inStock: true };
    setCustomizations([...customizations, newCustomization]);
    setNewCustomizationData({ price: 0 });
    setShowCustomizationModal(false);
  };

  const renderCustomizations = (groups) => {
    const renderedElements = [];

    for (const group of groups) {
      if (group.seq === 1) {
        renderedElements.push(
          <React.Fragment key={group.id}>
            <CustomizationGroup
              group={group}
              customizationGroups={customizationGroups}
              handleGroupChange={handleGroupChange}
              openCustomizationModal={openCustomizationModal}
              newCustomizationData={newCustomizationData}
              setNewCustomizationData={setNewCustomizationData}
            />
            {renderCustomizationElements(group.id)}
          </React.Fragment>
        );
      }
    }

    return renderedElements;
  };

  const renderCustomizationElements = (groupId, level = 1) => {
    const renderedElements = [];

    const groupCustomizations = customizations.filter((customization) => customization.parent === groupId);
    for (const customization of groupCustomizations) {
      renderedElements.push(
        <Customization
          styles={{ marginLeft: `${level * 55}px` }}
          category={category}
          customization={customization}
          customizations={customizations}
          setCustomizations={setCustomizations}
          customizationGroups={customizationGroups}
          handleCustomizationChange={handleCustomizationChange}
          setShowCustomizationGroupModal={setShowCustomizationGroupModal}
          setSelectedCustomization={setSelectedCustomization}
        />
      );

      if (customization.child) {
        const childGroup = customizationGroups.find((g) => g.id === customization.child);
        if (childGroup) {
          renderedElements.push(
            <React.Fragment key={childGroup.id}>
              <CustomizationGroup
                group={childGroup}
                customizationGroups={customizationGroups}
                handleGroupChange={(event) => handleGroupChange(event, childGroup.id)}
                styles={{ marginLeft: `${(level + 1) * 60}px` }}
                openCustomizationModal={openCustomizationModal}
                newCustomizationData={newCustomizationData}
                setNewCustomizationData={setNewCustomizationData}
              />
              {renderCustomizationElements(childGroup.id, level + 2)}
            </React.Fragment>
          );
        }
      }
    }
    return renderedElements;
  };

  return (
    <div>
      <Button
        sx={{ marginBottom: 2 }}
        variant="contained"
        onClick={() => {
          setShowCustomizationGroupModal(true);
        }}
        disabled={!!customizationGroups.length}
      >
        Add Customization Group
      </Button>
      {renderCustomizations(customizationGroups)}
      <AddCustomizationGroup
        showModal={showCustomizationGroupModal}
        handleCloseModal={() => setShowCustomizationGroupModal(false)}
        newCustomizationGroupData={newCustomizationGroupData}
        setNewCustomizationGroupData={setNewCustomizationGroupData}
        customizationGroups={customizationGroups}
        handleAddCustomizationGroup={handleAddCustomizationGroup}
      />
      <AddCustomization
        showModal={showCustomizationModal}
        handleCloseModal={() => setShowCustomizationModal(false)}
        newCustomizationData={newCustomizationData}
        setNewCustomizationData={setNewCustomizationData}
        handleAddCustomization={handleAddCustomization}
      />
    </div>
  );
};

export default CustomizationRenderer;
