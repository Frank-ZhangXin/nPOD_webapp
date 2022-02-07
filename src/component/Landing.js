import React, { useEffect, useState } from "react";
import { API, Auth } from "aws-amplify";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { CssBaseline, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import Header from "./Header";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundImage: `url(${
      process.env.PUBLIC_URL + "/assets/landingPage.jpg"
    })`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    overflow: "hidden",
  },
  centerBox: {
    marginTop: "30vh",
    height: "70vh",
  },
  centerTitle: {
    textShadow: "0 0 20px black",
    color: "#a9c24a",
    fontFamily: "Open Sans",
  },
  centerTitle2: {
    //marginTop: "-50px",
    color: "#fff",
    textShadow: "0 0 20px black",
    fontFamily: "Open Sans",
  },
  centerTitle3: {
    marginTop: "8vh",
  },
  centerTitle4: {
    display: "flex",
    justifyContent: "center",
    marginTop: "8vh",
    color: "#fff",
    fontWeight: "600",
    textShadow: "0 0 20px black",
    fontFamily: "Open Sans",
  },
  centerContent: {
    color: "#fff",
    fontSize: "2rem",
    textShadow: "0 0 20px black",
  },
  centerButton: {
    //marginLeft: "30px",
    textShadow: "0 0 20px black",
    margin: "1vh",
  },
  centerButtonEmpty: {
    margin: "50px",
  },
  colorText: {
    color: "#5AFF3D",
  },
  linkText: {
    textDecoration: "none",
    padding: "2px",
    color: "white",
  },
  helpText: {
    padding: "10px",
    textShadow: "0 0 20px white",
  },
}));

const LandingPageTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    color: "#000000",
    border: "1px solid #dadde9",
    maxWidth: "420px",
    fontSize: 15,
  },
}))(Tooltip);

function Landing(props) {
  const classes = useStyles();
  const [caseDataNum, setCaseDataNum] = useState(0);
  const [authed, setAuthed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [imageWidth, setImageWidth] = useState("");
  const [title1, setTitle1] = useState("h1");
  const [title2, setTitle2] = useState("h2");
  const [title4, setTitle4] = useState("subtitle1");
  const history = useHistory();

  const helpTextNotAvailable = (
    <React.Fragment>
      <div className={classes.helpText}>Coming Soon</div>
    </React.Fragment>
  );

  const handleExploreCase = () => {
    history.push("/explore");
  };

  const handleSupport = () => {
    history.push("/support");
  };

  const handleContact = () => {
    history.push("/contact");
  };

  const updateResponsiveWidth = () => {
    if (window.innerWidth >= 1920) {
      setImageWidth("30vh");
      setTitle1("h1");
      setTitle2("h3");
      setTitle4("h5");
    } else if (window.innerWidth >= 1360 && window.innerWidth < 1920) {
      setImageWidth("25vh");
      setTitle1("h1");
      setTitle2("h3");
      setTitle4("h5");
    } else if (window.innerWidth >= 800 && window.innerWidth < 1360) {
      setImageWidth("20vh");
      setTitle1("h2");
      setTitle2("h4");
      setTitle4("h6");
    } else {
      setImageWidth("15vh");
      setTitle1("h3");
      setTitle2("h5");
      setTitle4("h6");
    }
  };
  useEffect(() => {
    updateResponsiveWidth();
    window.addEventListener("resize", updateResponsiveWidth);
    return () => window.removeEventListener("resize", updateResponsiveWidth);
  });

  console.log("image width", imageWidth);

  return (
    <div>
      <Header location="Home" />
      <div className={classes.root}>
        <CssBaseline />
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.centerBox}
        >
          <Grid item>
            <Typography variant={title1} className={classes.centerTitle}>
              <span style={{ fontWeight: 300 }}>DATA</span>{" "}
              <span style={{ fontWeight: 700 }}>PORTAL</span>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant={title2} className={classes.centerTitle2}>
              <p style={{ fontWeight: 400 }}>Sharing for a Cure</p>
            </Typography>
          </Grid>
          <Grid item style={{ width: "100%" }}>
            {props.signedIn ? (
              <Box
                display={"flex"}
                justifyContent={"center"}
                className={classes.centerTitle3}
              >
                <Box className={classes.centerButton}>
                  <Link onClick={handleExploreCase}>
                    <img
                      style={{ width: imageWidth }}
                      src="/assets/landingPageImages/ExploreCases.png"
                    />
                  </Link>
                </Box>
                <Box className={classes.centerButton}>
                  <a target="_blank" href="http://npoddatashare.coh.org">
                    <img
                      style={{ width: imageWidth }}
                      src="/assets/landingPageImages/SampleInventory.png"
                    />
                  </a>
                </Box>
                <Box className={classes.centerButton}>
                  <LandingPageTooltip
                    title={helpTextNotAvailable}
                    placement="top"
                  >
                    <img
                      style={{ width: imageWidth }}
                      src="/assets/landingPageImages/ExploreDatasetsNotAvailable.png"
                    />
                  </LandingPageTooltip>
                </Box>
                <Box className={classes.centerButton}>
                  <LandingPageTooltip
                    title={helpTextNotAvailable}
                    placement="top"
                  >
                    <img
                      style={{ width: imageWidth }}
                      src="/assets/landingPageImages/SubmitDatasetsNotAvailable.png"
                    />
                  </LandingPageTooltip>
                </Box>
              </Box>
            ) : (
              <div className={classes.centerButtonEmpty}>&nbsp;</div>
            )}
          </Grid>
          <Grid item>
            <Typography variant={title4} className={classes.centerTitle4}>
              <Link onClick={handleSupport} className={classes.linkText}>
                SUPPORT
              </Link>{" "}
              |{" "}
              <Link onClick={handleContact} className={classes.linkText}>
                CONTACT
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

// Subscribe
const mapStateToProps = (state) => {
  return {
    signedIn: state.auth.signedIn,
  };
};

// Update
const mapDispatchToProps = (dispatch) => {
  return {
    setSignedIn: (newSignedIn) =>
      dispatch({ type: "SET_SIGNEDIN", value: newSignedIn }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
