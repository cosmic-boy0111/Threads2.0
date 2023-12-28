'use client'
import { Button } from '../ui/button'

interface Props {
    displayName : string,
    className : string,
    onClick? : any
}

const Option = ({
    displayName,
    className,
    onClick
} : Props) => {
    return (
        <Button onClick={onClick} variant="secondary" className={className}>
            {displayName}
        </Button>
    )
}

export default Option