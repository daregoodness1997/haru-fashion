import { useCurrency } from "../../context/CurrencyContext";

type PriceProps = {
  amount: number;
  className?: string;
};

const Price: React.FC<PriceProps> = ({ amount, className = "" }) => {
  const { formatPrice } = useCurrency();

  return <span className={className}>{formatPrice(amount)}</span>;
};

export default Price;
