import os
from typing import Optional, Dict
from logging import getLogger
logger = getLogger(__name__)

def get_profilic_params(params: Dict) -> Optional[Dict]:
    if params.get("PROLIFIC_PID") is None and params.get("STUDY_ID") is None and params.get("SESSION_ID") is None:
        return {}
    return {
        "PROLIFIC_PID": params.get("PROLIFIC_PID"),
        "STUDY_ID": params.get("STUDY_ID"),
        "SESSION_ID": params.get("SESSION_ID"),
    }


def get_prolific_redirect(**kwargs) -> str:
    if "completed" in kwargs and kwargs.get("completed"):
        code = os.environ.get("PROLIFIC_COMPLETED_CODE")
    elif "consent" in kwargs and kwargs.get("consent"):
        code = os.environ.get("PROLIFIC_NO_CONSENT_CODE")
    elif "bad_device" in kwargs and kwargs.get("bad_device"):
        code = os.environ.get("PROLIFIC_BAD_DEVICE_CODE")
    elif "excluded" in kwargs and kwargs.get("excluded"):
        code = os.environ.get("PROLIFIC_EXCLUDED_CODE")
    return f"https://app.prolific.co/submissions/complete?cc={code}"