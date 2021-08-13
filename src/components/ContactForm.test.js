import React from "react";
import {
  getByDisplayValue,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactForm from "./ContactForm";

test("renders without errors", () => {
  render(<ContactForm />);
});

test("renders the contact form header", () => {
  //Arrage : render the App component and find the header element
  const { getByText } = render(<ContactForm />);
  const header = getByText(/contact form/i);
  expect(header).toBeInTheDocument();
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  const { getByLabelText } = render(<ContactForm />);

  // const nameLabel = screen.getByText(/First Name/i)
  const nameInput = getByLabelText(/first name/i);

  userEvent.type(nameInput, "kai");

  const nameErr = screen.getByText(
    /firstName must have at least 5 characters./
  );
  expect(nameErr).toBeInTheDocument();
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);
  const nameInput = screen.getByLabelText(/first name/i);
  const lastNameInput = screen.getByLabelText(/last name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const submitButton = screen.getByRole("button", { name: /submit/i });

  // userEvent.type(nameInput, " ")
  // userEvent.type(lastNameInput, " ")
  // userEvent.clear(lastNameInput)
  // userEvent.type(emailInput," ")
  userEvent.click(submitButton);

  const nameErr = screen.getByText(
    /firstName must have at least 5 characters./
  );
  const lastNameErr = screen.getByText(/lastName is a required field./);
  const emailErr = screen.getByText(/email must be a valid email address./);
  expect(nameErr).toBeInTheDocument();
  expect(lastNameErr).toBeInTheDocument();
  expect(emailErr).toBeInTheDocument();
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);
  const submitButton = screen.getByRole("button", { name: /submit/i });
  const nameInput = screen.getByLabelText(/first name/i);
  const lastNameInput = screen.getByLabelText(/last name/i);
  const emailInput = screen.getByLabelText(/email/i);

  userEvent.type(nameInput, "jhonson");
  userEvent.type(lastNameInput, "lovingfoss");
  userEvent.type(emailInput, "");
  userEvent.click(submitButton);

  const emailErr = screen.getByText(/email must be a valid email address./);

  expect(emailErr).toBeInTheDocument();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  const emailInput = screen.getByLabelText(/email/i);

  userEvent.type(emailInput, "cool");

  const emailErr = screen.getByText(/email must be a valid email address./);
  expect(emailErr).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);
  const submitButton = screen.getByRole("button", { name: /submit/i });
  const lastNameInput = screen.getByLabelText(/last name/i);

  userEvent.type(lastNameInput, "");
  userEvent.click(submitButton);
  const lastNameErr = screen.getByText(/lastName is a required field./);

  expect(lastNameErr).toBeInTheDocument();
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);
  const nameInput = screen.getByLabelText(/first name/i);
  const lastNameInput = screen.getByLabelText(/last name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const submitButton = screen.getByRole("button", { name: /submit/i });

  userEvent.type(nameInput, "Jonason");
  userEvent.type(lastNameInput, "lovingfoss");
  userEvent.type(emailInput, "sayo0804@gmail.com");

  let nameSuccess = screen.queryByText(/First Name: Jonason/i);
  let lastNameSuccess = screen.queryByText(/Last Name: lovingfoss/i);
  let emailSuccess = screen.queryByText(/Email: sayo0804@gmail.com/i);
  expect(nameSuccess).toBeNull();
  expect(nameSuccess).not.toBeInTheDocument();
  expect(lastNameSuccess).toBeNull();
  expect(lastNameSuccess).not.toBeInTheDocument();
  expect(emailSuccess).toBeNull();
  expect(emailSuccess).not.toBeInTheDocument();

  userEvent.click(submitButton);

  nameSuccess = screen.getByText(/Jonason/i);
  lastNameSuccess = screen.getByText(/lovingfoss/i);
  emailSuccess = screen.getByText(/sayo0804@gmail.com/i);

  expect(nameSuccess).toBeInTheDocument();
  expect(lastNameSuccess).toBeInTheDocument();
  expect(emailSuccess).toBeInTheDocument();
});

test("renders all fields text when all fields are submitted.", async () => {
  render(<ContactForm />);
  const nameInput = screen.getByLabelText(/first name/i);
  const lastNameInput = screen.getByLabelText(/last name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const messageInput = screen.getByLabelText(/message/i);

  userEvent.type(nameInput, "Jonason");
  userEvent.type(lastNameInput, "lovingfoss");
  userEvent.type(emailInput, "sayo0804@gmail.com");
  userEvent.type(messageInput, "Thank you!");
  const submitButton = await screen.getByRole("button", { name: /submit/i });
  userEvent.click(submitButton);

  await waitFor(() => {
    let nameSuccess = screen.getByText(/Jonason/i);
    let lastNameSuccess = screen.getByText(/lovingfoss/i);
    let emailSuccess = screen.getByText(/sayo0804@gmail.com/i);
    let messageSuccess = screen.getByTestId("messageDisplay");

    expect(nameSuccess).toBeInTheDocument();
    expect(lastNameSuccess).toBeInTheDocument();
    expect(emailSuccess).toBeInTheDocument();
    expect(messageSuccess).toBeInTheDocument();
    expect(messageSuccess).toHaveTextContent("Thank you!");

    // having trouble finding message
  });
});
