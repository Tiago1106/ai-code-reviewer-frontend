import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/states";

// Mock next/link to render a simple anchor
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("EmptyState", () => {
  it("renders default title", () => {
    render(<EmptyState />);

    expect(screen.getByText("nenhum_resultado")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(<EmptyState title="sem_dados" />);

    expect(screen.getByText("sem_dados")).toBeInTheDocument();
  });

  it("renders default description", () => {
    render(<EmptyState />);

    expect(
      screen.getByText("Não há dados para exibir."),
    ).toBeInTheDocument();
  });

  it("renders custom description", () => {
    render(<EmptyState description="Nenhum review encontrado." />);

    expect(
      screen.getByText("Nenhum review encontrado."),
    ).toBeInTheDocument();
  });

  it("renders link when linkHref is provided", () => {
    render(<EmptyState linkHref="/review" />);

    const link = screen.getByText("$ novo_review");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/review");
  });

  it("renders custom link label", () => {
    render(<EmptyState linkHref="/review" linkLabel="criar_review" />);

    expect(screen.getByText("$ criar_review")).toBeInTheDocument();
  });

  it("does not render link when linkHref is omitted", () => {
    render(<EmptyState />);

    expect(screen.queryByText("$ novo_review")).not.toBeInTheDocument();
  });
});
