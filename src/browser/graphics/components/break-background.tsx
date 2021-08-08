import dot1 from "../images/break/dot1.png";
import dot2 from "../images/break/dot2.png";
import dot3 from "../images/break/dot3.png";
import dot4 from "../images/break/dot4.png";
import rtachan from "../images/break/rtachan.png";
import classNames from "./break-background.css";

export const BreakBackground = () => (
	<div className='bg'>
		<img src={dot1} className={classNames["deep1"]} />
		<img src={dot2} className={classNames["deep1"]} />
		<img src={dot3} className={classNames["deep1"]} />
		<img src={dot4} className={classNames["deep1"]} />
		<img src={dot4} className={classNames["deep1"]} />
		<img src={dot3} className={classNames["deep1"]} />
		<img src={dot2} className={classNames["deep1"]} />
		<img src={dot1} className={classNames["deep1"]} />
		<img src={dot1} className={classNames["deep1"]} />
		<img src={dot2} className={classNames["deep1"]} />
		<img src={dot3} className={classNames["deep1"]} />
		<img src={dot4} className={classNames["deep1"]} />
		<img src={dot4} className={classNames["deep1"]} />
		<img src={dot3} className={classNames["deep1"]} />
		<img src={dot2} className={classNames["deep1"]} />
		<img src={dot1} className={classNames["deep1"]} />
		<img src={rtachan} className={classNames["rtachan"]} />
	</div>
);
