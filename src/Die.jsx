
export default function Die(props) {
    const isAnimated = (props.isRolling && !props.isHeld)
    const styles = {
        backgroundColor: props.isHeld ? "var(--color-die-held)" : "var(--color-die-bg)",
        animationDelay: isAnimated ? `${props.index * 50}ms` : "0ms"
    }

    return (
        <button
            style={styles}
            className={isAnimated ? "rolling" : ""}
            onClick={props.hold}
            aria-pressed={props.isHeld}
            aria-label={`Die with value ${props.value}, ${props.isHeld ? "held" : "not held"}`}
        >{props.value}</button>
    )
}