import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './Tooltip.module.scss';

interface Props {
    children?: JSX.Element | JSX.Element[] | string;
    content: JSX.Element | string | undefined; // undefined -> no tooltip
    element?: string;
    props?: object;
};

const SPACE_X = 15;
const SPACE_Y = 20;

let portalElement: HTMLDivElement | undefined;

let widthOfTooltip: number = 0;
let heightOfTooltip: number = 0;

const TOOLTIP_DISTANCE_TO_WINDOW = 20;

let tooltipActionCount = 0;

class Tooltip extends Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    mouseEnter(event: React.MouseEvent) {
        const content = this.props.content;
        if (!content) {
            return;
        }

        tooltipActionCount += 1;
        if (!portalElement) {
            portalElement = document.createElement('div');
            portalElement.className = styles.portal;
            document.body.appendChild(portalElement);
        }
        portalElement.classList.remove(styles.hidden);

        ReactDOM.render(typeof content === 'string' ? <>{content}</> : content, portalElement);
        
        const { pageX, pageY } = event;
        this.setTooltipPosition(-10000, -10000);

        setTimeout(() => {
            widthOfTooltip = portalElement!.offsetWidth;
            heightOfTooltip = portalElement!.offsetHeight;
            this.setTooltipPosition(pageX, pageY);
        }, 0);
    }

    mouseLeave = () => {
        let currentActionId = tooltipActionCount;
        setTimeout(() => {
            if (portalElement && currentActionId === tooltipActionCount) { // check if a new tooltip was already opened
                portalElement.classList.add(styles.hidden);
            }
        }, 0);
    }

    mouseMove(event: React.MouseEvent) {
        this.setTooltipPosition(event.pageX, event.pageY);
    }

    setTooltipPosition(x: number, y: number) {
        if (portalElement) {
            const mostRightPosition = window.innerWidth - widthOfTooltip - TOOLTIP_DISTANCE_TO_WINDOW;
            const mostBottomPosition = window.innerHeight + window.scrollY - heightOfTooltip - TOOLTIP_DISTANCE_TO_WINDOW;
            portalElement.style.left = Math.min(SPACE_X + x, mostRightPosition) + 'px';
            portalElement.style.top = Math.min(SPACE_Y + y, mostBottomPosition) + 'px';
        }
    }

    componentWillUnmount() {
        if (portalElement) {
            portalElement.classList.add(styles.hidden);
        }
    }

    render() {
        return React.createElement(this.props.element || 'div', {
            ...this.props.props,
            onMouseEnter: (e) => this.mouseEnter(e),
            onMouseLeave: () => this.mouseLeave(),
            onMouseMove: (e) => this.mouseMove(e),
        }, this.props.element === 'img' ? undefined : [this.props.children]);
    }
}

export default Tooltip;