import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import HowItWorks from "./app/HowItWorks";
import Footer from "./components/footer";
import Header from "./components/header";
import MainComponent from "./MainComponent";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <Switch>
          <Route exact path="/" component={MainComponent} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/the-bookshelves" component={MainComponent} />
          {/* Add other routes here */}
        </Switch>
        <Footer
          description="Dive into a world where books and coffee create magic. At TheBookShelves, we're more than just a collection of paperbacks at your favorite cafés—our community thrives on the love for stories and the joy of shared experiences."
          subtext="Sip, read, and connect with us today!"
          linksLeft={[
            { href: "/how-it-works", text: "How it works ?" },
            { href: "#", text: "Terms of Use" },
            { href: "#", text: "Sales and Refunds" },
          ]}
          linksRight={[
            { href: "#", text: "Pricing" },
            { href: "#", text: "Careers" },
            { href: "#", text: "Meet the team" },
            { href: "#", text: "Contact" },
          ]}
        />
      </div>
    </Router>
  );
}

export default App;