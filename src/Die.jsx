
export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "var(--color-die-held)" : "var(--color-die-bg)"
    }

    return (
        <button
            style={styles}
            onClick={props.hold}
            aria-pressed={props.isHeld}
            aria-label={`Die with value ${props.value}, ${props.isHeld ? "held" : "not held"}`}
        >{props.value}</button>
    )
}