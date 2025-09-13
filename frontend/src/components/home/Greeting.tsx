import { GetUserMeta } from "@go/main/App";
import { data } from "@go/models";
import { Fragment, useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const Greeting = () => {
  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [icon, setIcon] = useState(<></>);
  const [userMeta, setUserMeta] = useState<data.UserMeta>();

  const timeOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  const greet = () => {
    const now = new Date();

    const hour = now.getHours();

    if (hour >= 0 && hour < 12) {
      setGreeting("Good Morning");
      setIcon(<FaSun color="orange" size={50} />);
    } else if (hour >= 12 && hour < 16) {
      setGreeting("Good Afternoon");
      setIcon(<FaSun color="yellow" size={50} />);
    } else if (hour >= 16 && hour <= 23) {
      setIcon(<FaMoon color="orange.200" size={50} />);
      setGreeting("Good Evening");
    }

    setTime(now);
  };

  const getUser = async () => {
    const userMeta = await GetUserMeta();
    setUserMeta(userMeta);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    greet();
    const timerID = setInterval(greet, 1000);
    return () => clearInterval(timerID);
  }, []);

  return (
    <Fragment>
      <div className="flex items-center space-x-4">
        <h1 className="font-semibold text-xl sm:text-2xl md:text-4xl leading-tight">
          <span className="text-green-400">
            {greeting}
            {userMeta && `, ${userMeta.name}`}
          </span>
        </h1>
        {icon}
      </div>
      <p className="text-gray-500">
        {time.toLocaleString("en-US", timeOptions)}
      </p>
    </Fragment>
  );
};

export default Greeting;
