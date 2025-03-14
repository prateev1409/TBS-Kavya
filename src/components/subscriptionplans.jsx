"use client"; // Ensure this is a Client Component
function MainComponent({ plan, isSelected, onSelect, isCurrentPlan }) {
  return (
    <div
      className={`
        relative border rounded-xl p-6 transition-all hover:shadow-lg
        ${isSelected ? "border-border-dark dark:border-border-light shadow-lg" : "border-border-light dark:border-border-dark"}
        ${isCurrentPlan ? "bg-backgroundSCD-light dark:bg-backgroundSCD-dark" : "bg-background-light dark:bg-background-dark"}
      `}
    >
      {plan.name === "Standard" && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark text-sm py-1 px-4 rounded-full">
          Most Popular
        </div>
      )}

      <div className="h-48 mb-6 overflow-hidden rounded-lg">
        <img
          src={`/subscription-${plan.name.toLowerCase()}.jpg`}
          alt={`${plan.name} plan showing ${plan.booksPerMonth} book${plan.booksPerMonth > 1 ? "s" : ""}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold font-header mb-2 text-text-light dark:text-text-dark">{plan.name}</h3>
        <p className="text-4xl font-bold text-text-light dark:text-text-dark">
          ${plan.price}
          <span className="text-sm font-normal text-text-light dark:text-text-dark">/month</span>
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center text-text-light dark:text-text-dark">
          <i className="fas fa-book text-primary-light dark:text-primary-dark mr-3"></i>
          <span className="font-medium font-body">
            {plan.booksPerMonth} book{plan.booksPerMonth > 1 ? "s" : ""} per month
          </span>
        </div>

        <div className="flex items-center text-text-light dark:text-text-dark">
          <i className="fas fa-coffee text-secondary-light dark:text-secondary-dark mr-3"></i>
          <span className="font-medium font-body">{plan.cafeDiscount}% off at cafe</span>
        </div>

        <div className="h-px bg-border-light dark:bg-border-dark my-4"></div>

        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center text-text-light dark:text-text-dark">
            <i className="fas fa-check text-tertiary-light dark:text-tertiary-dark mr-3"></i>
            <span className="font-body">{feature}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onSelect(plan)}
        className={`
          w-full py-3 px-4 rounded-full font-medium transition-colors font-button
          ${
            isCurrentPlan
              ? "bg-backgroundSCD-light dark:bg-backgroundSCD-dark cursor-not-allowed"
              : isSelected
                ? "bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark hover:bg-primary-light dark:hover:bg-primary-dark"
                : "bg-background-light dark:bg-background-dark hover:bg-backgroundSCD-light dark:hover:bg-backgroundSCD-dark"
          }
        `}
        disabled={isCurrentPlan}
      >
        {isCurrentPlan ? "Current Plan" : "Select Plan"}
      </button>
    </div>
  );
}

function StoryComponent() {
  const plans = [
    {
      name: "Basic",
      price: 9.99,
      booksPerMonth: 1,
      cafeDiscount: 10,
      features: [
        "Access to all bookstore cafes",
        "Basic member events",
        "Mobile app access",
        "Monthly newsletter",
      ],
    },
    {
      name: "Standard",
      price: 19.99,
      booksPerMonth: 2,
      cafeDiscount: 15,
      features: [
        "Priority cafe seating",
        "Member-only events",
        "Early book releases",
        "Reading group access",
        "Quarterly book curator call",
      ],
    },
    {
      name: "Premium",
      price: 29.99,
      booksPerMonth: 3,
      cafeDiscount: 25,
      features: [
        "VIP cafe access",
        "Exclusive author events",
        "Early book releases",
        "Monthly book curator call",
        "Free event guest passes",
        "Author meet & greets",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <MainComponent
              key={plan.name}
              plan={plan}
              isSelected={false}
              onSelect={() => console.log(`${plan.name} plan selected`)}
              isCurrentPlan={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default StoryComponent;


