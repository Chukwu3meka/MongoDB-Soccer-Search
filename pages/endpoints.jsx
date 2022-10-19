import EndpointsContainer from "@component/endpoints";
import { fetcher } from "@utils/clientFuncs";

const EndpointsPage = ({ initialEndpoints }) => {
  return <EndpointsContainer initialEndpoints={initialEndpoints} />;
};

export default EndpointsPage;

export async function getServerSideProps() {
  try {
    const initialEndpoints = await fetcher(`${process.env.HOST}/api/client/getEndpoints`);

    return { props: { initialEndpoints } };
  } catch (e) {
    return { props: { initialEndpoints } };
  }
}
