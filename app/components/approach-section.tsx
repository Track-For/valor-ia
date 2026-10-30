import "./approach-section.css";

const approachSteps = [
  {
    title: "Sua operação",
    description: "Entendemos a rotina de vendas, os desafios e o momento do seu negócio no Magalu",
  },
  {
    title: "Organização",
    description: "Organizamos receitas, custos e despesas para trazer mais clareza ao financeiro do dia a dia",
  },
  {
    title: "Contabilidade",
    description: "Cuidamos da rotina contábil com atenção às necessidades de cada fase da operação",
  },
  {
    title: "Resultados",
    description: "Transformamos os números em informações para você acompanhar o desempenho e tomar decisões",
  },
  {
    title: "Próximos passos",
    description: "Apoiamos a gestão conforme o negócio evolui, seja para ganhar controle ou preparar o crescimento",
  },
] as const;

function polygonPoints(sides: number, samples = 32) {
  const vertices = Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / sides;
    return { x: 50 + Math.cos(angle) * 36, y: 50 + Math.sin(angle) * 36 };
  });

  return Array.from({ length: samples }, (_, index) => {
    const position = (index * sides) / samples;
    const start = vertices[Math.floor(position)];
    const end = vertices[(Math.floor(position) + 1) % sides];
    const fraction = position % 1;
    const x = start.x + (end.x - start.x) * fraction;
    const y = start.y + (end.y - start.y) * fraction;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
}

export const approachShapePoints = [3, 4, 5, 8, 32].map((sides) => polygonPoints(sides));

export function ApproachSection() {
  return (
    <section className="approach-section" id="abordagem" aria-labelledby="approach-title">
      <div className="approach-top">
        <div className="approach-heading">
          <p className="approach-kicker">COMO TRABALHAMOS / VALOR IA</p>
          <h2 id="approach-title">Mais clareza para decidir.<br />Mais tempo para <em>vender</em></h2>
        </div>
        <p className="approach-intro">Para quem vende no Magalu, a gestão precisa acompanhar o ritmo da operação. A Valor IA reúne apoio financeiro e contábil para organizar informações, entender resultados e orientar os próximos passos do negócio</p>
      </div>

      <div className="approach-stage">
        <ol className="approach-cards">
          {approachSteps.map((step, index) => (
            <li className="approach-card" key={step.title}>
              <div className="approach-card-panel" aria-hidden="true" />
              <div className="approach-card-copy">
                <span className="approach-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="approach-path" aria-hidden="true">
          <span className="approach-dashed-line" />
          <svg className="approach-shape" viewBox="0 0 100 100" focusable="false">
            <polygon points={approachShapePoints[0]} />
          </svg>
        </div>
      </div>
    </section>
  );
}
