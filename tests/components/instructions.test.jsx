import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Instructions from "../../components/Instructions";

const mockRecipe = {
  title: "Test Recipe",
  image: "https://example.com/test-image.jpg",
  extendedIngredients: [
    {
      id: 1,
      nameClean: "Flour",
      measures: {
        metric: { amount: 200, unitLong: "grams" },
        us: { amount: 7, unitLong: "oz" },
      },
    },
    {
      id: 2,
      nameClean: "Sugar",
      measures: {
        metric: { amount: 100, unitLong: "grams" },
        us: { amount: 3.5, unitLong: "oz" },
      },
    },
  ],
  analyzedInstructions: [
    {
      steps: [
        { number: 1, step: "Mix the ingredients together." },
        { number: 2, step: "Bake at 350 degrees for 30 minutes." },
      ],
    },
  ],
};

describe("Instructions Component", () => {
  it("should display the recipe instructions modal when button is pressed", () => {
    const { getByTestId, getByText, queryByText } = render(
      <Instructions recipe={mockRecipe} />
    );

    // Check that instructions are hidden initially
    expect(queryByText("Test Recipe")).toBeNull();

    // Press the "Instructions" button
    const instructionsButton = getByTestId("showInstructionsButton");
    fireEvent.press(instructionsButton);

    // Check that modal appears and contains the recipe title
    expect(getByText("Test Recipe")).toBeTruthy();

    // Check that ingredients are displayed
    expect(getByText("Flour")).toBeTruthy();
    expect(getByText("Sugar")).toBeTruthy();

    // Check that instructions are displayed
    expect(getByText("Step 1")).toBeTruthy();
    expect(getByText("Mix the ingredients together.")).toBeTruthy();
    expect(getByText("Step 2")).toBeTruthy();
    expect(getByText("Bake at 350 degrees for 30 minutes.")).toBeTruthy();
  });

  it("should switch between metric and imperial measurements", () => {
    const { getByText, getByTestId } = render(
      <Instructions recipe={mockRecipe} />
    );

    // Open modal
    fireEvent.press(getByTestId("showInstructionsButton"));

    // Check for metric ingredients initially
    expect(getByText("200 grams")).toBeTruthy();
    expect(getByText("100 grams")).toBeTruthy();

    // Toggle to imperial units
    fireEvent.press(getByText("Switch to Imperial"));

    // Check for imperial ingredients
    expect(getByText("7 oz")).toBeTruthy();
    expect(getByText("3.5 oz")).toBeTruthy();

    // Toggle back to metric units
    fireEvent.press(getByText("Switch to Metric"));
    expect(getByText("200 grams")).toBeTruthy();
  });

  it("should close the instructions modal when hide button is pressed", () => {
    const { getByTestId, getByText, queryByText } = render(
      <Instructions recipe={mockRecipe} />
    );

    // Open modal
    fireEvent.press(getByTestId("showInstructionsButton"));

    // Ensure modal is open
    expect(getByText("Test Recipe")).toBeTruthy();

    // Press the "Hide Instructions" button
    fireEvent.press(getByText("Hide Instructions"));

    // Ensure modal is closed
    expect(queryByText("Test Recipe")).toBeNull();
  });
});
