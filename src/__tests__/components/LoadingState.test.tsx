import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingState } from "@/components/states";

describe("LoadingState", () => {
  it("renders default title", () => {
    render(<LoadingState />);

    expect(screen.getByText("carregando...")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(<LoadingState title="processando..." />);

    expect(screen.getByText("processando...")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<LoadingState description="Aguarde um momento." />);

    expect(screen.getByText("Aguarde um momento.")).toBeInTheDocument();
  });

  it("does not render description when omitted", () => {
    const { container } = render(<LoadingState />);

    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(0);
  });

  it("renders spinner element", () => {
    const { container } = render(<LoadingState />);

    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });
});
