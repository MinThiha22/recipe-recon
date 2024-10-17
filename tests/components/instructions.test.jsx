import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Instructions from "../../components/Instructions";
import { Alert } from "react-native";

// Mock the Alert API
jest.spyOn(Alert, "alert");

// Displays recipe details in modal when 'Instructions' button is pressed
describe("<Instructions />", () => {
  const mockRecipe = {
    title: "Test Recipe",
    image: "https://example.com/test-image.jpg",
    extendedIngredients: [
      {
        id: 1,
        nameClean: "Ingredient 1",
        measures: { us: { amount: 1, unitLong: "cup" } },
      },
      {
        id: 2,
        nameClean: "Ingredient 2",
        measures: { us: { amount: 2, unitLong: "tbsp" } },
      },
    ],
    analyzedInstructions: [
      {
        steps: [
          { number: 1, step: "Mix ingredients together." },
          { number: 2, step: "Bake for 20 minutes." },
        ],
      },
    ],
  };

  it("shows instructions modal when button is pressed", async () => {
    const { getByText, queryByText, getByTestId } = render(
      <Instructions recipe={mockRecipe} />
    );

    // The modal should not be visible initially
    expect(queryByText("Test Recipe")).toBeNull();

    // Press the Instructions button to show the modal using its testID
    fireEvent.press(getByTestId("showInstructionsButton"));

    // Wait for the modal content to appear
    await waitFor(() => {
      expect(getByText("Test Recipe")).toBeTruthy();
      expect(getByText("Ingredients")).toBeTruthy();
      expect(getByTestId("instructionsHeader")).toBeTruthy();
    });

    // Check if the image is rendered correctly
    const image = getByTestId("recipeImage");
    expect(image.props.source.uri).toBe("https://example.com/test-image.jpg");

    // Check if ingredients and steps are rendered
    expect(getByText("Ingredient 1")).toBeTruthy();
    expect(getByText("1 cup")).toBeTruthy();
    expect(getByText("Ingredient 2")).toBeTruthy();
    expect(getByText("2 tbsp")).toBeTruthy();
    expect(getByText("Step 1")).toBeTruthy();
    expect(getByText("Mix ingredients together.")).toBeTruthy();
    expect(getByText("Step 2")).toBeTruthy();
    expect(getByText("Bake for 20 minutes.")).toBeTruthy();
  });
});
