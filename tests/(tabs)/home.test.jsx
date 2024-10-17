import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import Home from "../../app/(tabs)/home";
import { Alert } from "react-native";
import { saveIngredients, checkAuthState } from "../../lib/firebase";

jest.mock("../../lib/firebase", () => ({
  saveIngredients: jest.fn(),
  checkAuthState: jest.fn(),
}));

jest.spyOn(Alert, "alert");

describe("<Home />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: handleAddIngredient
  it("adds an ingredient to the list when handleAddIngredient is called", async () => {
    const { getByPlaceholderText, getByText } = render(<Home />);

    // Simulate entering ingredient
    const input = getByPlaceholderText("Type ingredient here...");
    fireEvent.changeText(input, "Tomato");

    // Simulate pressing Add Ingredient button
    await act(async () => {
      fireEvent.press(getByText("Add Ingredient"));
    });

    // Check if ingredient is added to the list
    const ingredientInList = getByText("Tomato");
    expect(ingredientInList).toBeTruthy();
  });

  // Test 2: handleRemoveIngredient
  it("removes an ingredient from the list when handleRemoveIngredient is called", async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<Home />);

    // Add ingredients
    const input = getByPlaceholderText("Type ingredient here...");
    fireEvent.changeText(input, "Tomato");
    await act(async () => {
      fireEvent.press(getByText("Add Ingredient"));
    });
    fireEvent.changeText(input, "Cheese");
    await act(async () => {
      fireEvent.press(getByText("Add Ingredient"));
    });

    // Simulate removing the first ingredient (Tomato)
    const removeButton = getByTestId("removeButton-0"); // Use testID for the first button
    await act(async () => {
      fireEvent.press(removeButton);
    });

    // Check if Tomato is removed from the list
    expect(getByText("Cheese")).toBeTruthy();
    expect(() => getByText("Tomato")).toThrow();
  });

  // Test 3: handleClearInput
  it("clears the input field when handleClearInput is called", async () => {
    const { getByPlaceholderText, getByTestId } = render(<Home />);

    // Enter ingredient in the input field
    const input = getByPlaceholderText("Type ingredient here...");
    fireEvent.changeText(input, "Tomato");

    // Simulate pressing the Clear Input button
    const clearInputButton = getByTestId("clearInputButton");
    await act(async () => {
      fireEvent.press(clearInputButton);
    });

    // Check if the input field is cleared
    expect(input.props.value).toBe("");
  });
});
