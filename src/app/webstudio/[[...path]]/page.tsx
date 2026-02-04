import WebStudioApp from "itswebday/webstudio";
import { invokeWebStudioAction } from "../actions";

export { metadata } from "itswebday/webstudio";

const WebStudioRoute = async ({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) => {
  return (
    <WebStudioApp
      params={params}
      invokeWebStudioAction={invokeWebStudioAction}
    />
  );
};

export default WebStudioRoute;
