import { describe, expect, vi, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeComponent } from "@/components/HomeComponent";
import "@testing-library/dom";
import { userEvent } from "@testing-library/user-event";

describe("HomeComponent", () => {
  it("should render the home page", () => {
    render(<HomeComponent onAsk={async () => ({ response: "", lesson: "" })} />);

    expect(screen.getByText("Quiz AI")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Digite sua pergunta/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should send message and show response", async () => {
    const mockAsk = vi.fn().mockResolvedValue({
      response: "Resposta sobre Pelé",
      lesson: "Lição sobre futebol",
    });

    const user = userEvent.setup();
    render(<HomeComponent onAsk={mockAsk} />);

    const input = screen.getByPlaceholderText(/Digite sua pergunta/i);
    const button = screen.getByRole("button");

    await user.type(input, "quem é pelé?");
    await user.click(button);

    expect(mockAsk).toHaveBeenCalledWith("quem é pelé?");
    expect(await screen.findByText("Resposta sobre Pelé")).toBeInTheDocument();
    expect(screen.getByText("Lição sobre futebol")).toBeInTheDocument();
  });
});
