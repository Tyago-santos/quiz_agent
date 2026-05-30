import { describe, expect, vi, it } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/dom";
import { userEvent } from "@testing-library/user-event";
import { RegisterComponent } from "@/components/RegisterComponent";

describe("RegisterComponent", () => {
  it("should render form", () => {
    render(<RegisterComponent onSubmit={() => {}} />);

    expect(screen.getByText("Faça login")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Logar/i })).toBeInTheDocument();
  });

  it("should logger user", async () => {
    const mockSubmit = vi.fn();
    render(<RegisterComponent onSubmit={mockSubmit} />);

    const user = userEvent.setup();
    const inputEmail = screen.getByLabelText("Email");
    const inputName = screen.getByLabelText("Nome");
    const inputSenha = screen.getByLabelText("senha");

    const buttonSubmit = screen.getByRole("button", { name: /Logar/i });

    await user.type(inputEmail, "xlzthiago@gmail.com");
    await user.type(inputName, "Thiago");
    await user.type(inputSenha, "123456");
    await user.click(buttonSubmit);

    expect(screen.getByDisplayValue("xlzthiago@gmail.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Thiago")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123456")).toBeInTheDocument();

    expect(mockSubmit).toHaveBeenCalled();
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith({
      email: "xlzthiago@gmail.com",
      username: "Thiago",
      password: "123456",
    });
  });

  it("should error email when hints the button", async () => {
    const mockSubmit = vi.fn();
    render(<RegisterComponent onSubmit={mockSubmit} />);

    const user = userEvent.setup();
    const inputEmail = screen.getByLabelText("Email");
    const inputName = screen.getByLabelText("Nome");
    const inputSenha = screen.getByLabelText("senha");
    const buttonSubmit = screen.getByRole("button", { name: /Logar/i });

    await user.type(inputEmail, "xlzthiaggmail.com");
    await user.type(inputName, "Thiago");
    await user.type(inputSenha, "123456");
    await user.click(buttonSubmit);

    expect(screen.getByText("Email inválido")).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("should error password when hints the button", async () => {
    const mockSubmit = vi.fn();
    render(<RegisterComponent onSubmit={mockSubmit} />);

    const user = userEvent.setup();
    const inputEmail = screen.getByLabelText("Email");
    const inputName = screen.getByLabelText("Nome");
    const inputSenha = screen.getByLabelText("senha");
    const buttonSubmit = screen.getByRole("button", { name: /Logar/i });

    await user.type(inputEmail, "xlzthiago@gmail.com");
    await user.type(inputName, "Thiago");
    await user.type(inputSenha, "1234");
    await user.click(buttonSubmit);

    expect(
      screen.getByText("Senha precisa ter 6 há mais de caracteres"),
    ).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("should error name when hints the button", async () => {
    const mockSubmit = vi.fn();
    render(<RegisterComponent onSubmit={mockSubmit} />);

    const user = userEvent.setup();
    const inputEmail = screen.getByLabelText("Email");
    const inputName = screen.getByLabelText("Nome");
    const inputSenha = screen.getByLabelText("senha");
    const buttonSubmit = screen.getByRole("button", { name: /Logar/i });

    await user.type(inputEmail, "xlzthiago@gmail.com");
    await user.type(inputName, "T");
    await user.type(inputSenha, "123456");
    await user.click(buttonSubmit);

    expect(
      screen.getByText("Nome precisa ter 2 há mais de caracteres"),
    ).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
