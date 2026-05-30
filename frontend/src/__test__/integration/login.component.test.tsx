import { describe, expect, vi, it } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/dom";
import { userEvent } from "@testing-library/user-event";
import { LoginComponent } from "@/components/LoginComponent";

describe("LoginComponent", () => {
  it("should render form", () => {
    render(<LoginComponent onSubmit={() => {}} />);

    expect(screen.getByText("Faça login")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Logar/i })).toBeInTheDocument();
  });

  it("should logger user", async () => {
    const mockSubmit = vi.fn();
    render(<LoginComponent onSubmit={mockSubmit} />);

    const user = userEvent.setup();
    const inputEmail = screen.getByLabelText("Email");
    const inputSenha = screen.getByLabelText("senha");

    const buttonSubmit = screen.getByRole("button", { name: /Logar/i });

    await user.type(inputEmail, "xlzthiago@gmail.com");
    await user.type(inputSenha, "123456");
    await user.click(buttonSubmit);

    expect(screen.getByDisplayValue("xlzthiago@gmail.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123456")).toBeInTheDocument();

    expect(mockSubmit).toHaveBeenCalled();
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith({
      email: "xlzthiago@gmail.com",
      password: "123456",
    });
  });

  it("should error email when hints the button", async () => {
    const mockSubmit = vi.fn();
    render(<LoginComponent onSubmit={mockSubmit} />);

    const user = userEvent.setup();
    const inputEmail = screen.getByLabelText("Email");
    const inputSenha = screen.getByLabelText("senha");
    const buttonSubmit = screen.getByRole("button", { name: /Logar/i });

    await user.type(inputEmail, "xlzthiaggmail.com");
    await user.type(inputSenha, "123456");
    await user.click(buttonSubmit);

    expect(screen.getByText("Email inválido")).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("should error password when hints the button", async () => {
    const mockSubmit = vi.fn();
    render(<LoginComponent onSubmit={mockSubmit} />);

    const user = userEvent.setup();
    const inputEmail = screen.getByLabelText("Email");
    const inputSenha = screen.getByLabelText("senha");
    const buttonSubmit = screen.getByRole("button", { name: /Logar/i });

    await user.type(inputEmail, "xlzthiago@gmail.com");
    await user.type(inputSenha, "1234");
    await user.click(buttonSubmit);

    expect(
      screen.getByText("Senha precisa ter 6 há mais de caracteres"),
    ).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
